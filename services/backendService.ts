
import { UserProfile, KYCStatus, AuditLogRecord } from '../types.ts';
import { supabase } from './supabaseClient.ts';

class BackendService {
  private user: UserProfile | null = null;
  public isDatabaseDegraded = false;

  private stringifyError(err: any): string {
    if (!err) return "Unknown error";
    if (typeof err === 'string') return err;
    const message = err.message || err.details || err.hint;
    if (message && typeof message === 'string') return message;
    try {
      if (err instanceof Error) return err.message;
      return JSON.stringify(err, Object.getOwnPropertyNames(err));
    } catch (e) {
      return String(err);
    }
  }

  // Novo: Cadastro via E-mail
  async signUp(email: string, pass: string, fullName: string): Promise<UserProfile> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { full_name: fullName } }
    });

    if (error) throw new Error(this.stringifyError(error));
    if (!data.user) throw new Error("Falha ao criar usuário.");

    // Criar perfil na tabela 'users'
    const profile = {
      id: data.user.id,
      address: 'pending_wallet_link',
      full_name: fullName,
      email: email,
      tier: 'BASIC'
    };

    const { error: profileError } = await supabase.from('users').insert(profile);
    if (profileError) console.warn("Erro ao criar perfil DB:", profileError);

    this.user = this.mapProfile(profile, null, profile.address);
    return this.user;
  }

  // Novo: Login via E-mail
  async signIn(email: string, pass: string): Promise<UserProfile> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw new Error(this.stringifyError(error));
    if (!data.user) throw new Error("Usuário não encontrado.");

    const { data: userData } = await supabase.from('users').select('*').eq('id', data.user.id).maybeSingle();
    this.user = this.mapProfile(userData || { id: data.user.id, email: data.user.email }, null, userData?.address || '');
    return this.user;
  }

  async authenticate(address: string, signature: string): Promise<UserProfile> {
    try {
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('address', address) 
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!userData) {
        this.user = {
          id: crypto.randomUUID(),
          address,
          name: 'Institutional Investor',
          email: `${address.slice(0, 6)}@garrett.io`,
          kycStatus: 'NOT_STARTED',
          tier: 'PRO',
          createdAt: Date.now()
        };
      } else {
        this.user = this.mapProfile(userData, null, address);
      }
    } catch (err: any) {
      this.isDatabaseDegraded = true;
      this.user = {
        id: `offline-${address.slice(0, 8)}`,
        address,
        name: 'Investor (Offline)',
        email: 'local@garrett.io',
        kycStatus: 'NOT_STARTED',
        tier: 'BASIC',
        createdAt: Date.now()
      };
    }
    return this.user!;
  }

  private mapProfile(db: any, kyc: any, address: string): UserProfile {
    return {
      id: db.id,
      address: address || '',
      name: db.full_name || db.name || 'Verified Member',
      email: db.email,
      kycStatus: (kyc?.status || 'NOT_STARTED') as KYCStatus,
      tier: (db.tier || 'BASIC') as any,
      createdAt: db.created_at ? new Date(db.created_at).getTime() : Date.now()
    };
  }

  getUser() { return this.user; }
  logout() { this.user = null; supabase.auth.signOut(); }
}

export const backendApi = new BackendService();

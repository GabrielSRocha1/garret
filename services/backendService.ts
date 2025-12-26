
import { UserProfile, KYCStatus } from '../types.ts';
import { supabase } from './supabaseClient.ts';

class BackendService {
  private user: UserProfile | null = null;
  public isDatabaseDegraded = false;

  async authenticate(address: string, signature: string): Promise<UserProfile> {
    try {
      // Em um ambiente real, enviaríamos o nonce + signature para o backend verificar.
      // Aqui, buscamos no Supabase pelo endereço real da wallet.
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('address', address) 
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!userData) {
        // Registro automático de nova wallet real
        const newUser: UserProfile = {
          id: crypto.randomUUID(),
          address: address,
          name: 'Institutional Member',
          email: `${address.slice(0, 8)}@garrett.io`,
          kycStatus: 'NOT_STARTED',
          tier: 'BASIC',
          createdAt: Date.now()
        };
        this.user = newUser;
      } else {
        this.user = {
            id: userData.id,
            address: userData.address,
            name: userData.full_name || 'Verified Member',
            email: userData.email,
            kycStatus: userData.kyc_status || 'NOT_STARTED',
            tier: userData.tier || 'BASIC',
            createdAt: new Date(userData.created_at).getTime()
        };
      }
    } catch (err: any) {
      console.warn("Database fallback mode activated. Using On-Chain Identity.");
      this.user = {
        id: `chain-${address.slice(0, 8)}`,
        address,
        name: 'On-Chain Identity',
        email: 'anonymous@garrett.io',
        kycStatus: 'NOT_STARTED',
        tier: 'BASIC',
        createdAt: Date.now()
      };
    }
    return this.user!;
  }

  getUser() { return this.user; }
  logout() { this.user = null; supabase.auth.signOut(); }

  async signUp(email: string, pass: string, fullName: string): Promise<UserProfile> {
     const { data, error } = await supabase.auth.signUp({ email, password: pass });
     if (error) throw error;
     return this.authenticate('pending_link', 'email_auth');
  }

  async signIn(email: string, pass: string): Promise<UserProfile> {
     const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
     if (error) throw error;
     return this.authenticate('pending_link', 'email_auth');
  }
}

export const backendApi = new BackendService();

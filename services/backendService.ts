
import { UserProfile, KYCStatus, Trade } from '../types.ts';
import { supabase } from './supabaseClient.ts';

class BackendService {
  private user: UserProfile | null = null;

  async authenticate(address: string, signature: string): Promise<UserProfile> {
    try {
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('address', address) 
        .maybeSingle();

      if (!userData) {
        this.user = {
          id: crypto.randomUUID(),
          address: address,
          name: 'Institutional Member',
          email: `${address.slice(0, 8)}@garrett.io`,
          kycStatus: 'approved',
          tier: 'BASIC',
          createdAt: Date.now(),
          fiatBalance: 0
        };
      } else {
        this.user = {
            id: userData.id,
            address: userData.address,
            name: userData.full_name || 'Verified Member',
            email: userData.email,
            kycStatus: userData.kyc_status || 'approved',
            tier: userData.tier || 'BASIC',
            createdAt: new Date(userData.created_at).getTime(),
            fiatBalance: userData.fiat_balance || 0
        };
      }
    } catch (err: any) {
      this.user = {
        id: `chain-${address.slice(0, 8)}`,
        address,
        name: 'On-Chain Identity',
        email: 'anonymous@garrett.io',
        kycStatus: 'approved',
        tier: 'BASIC',
        createdAt: Date.now(),
        fiatBalance: 0
      };
    }
    return this.user!;
  }

  // --- Added missing Auth methods ---

  /**
   * Registers a new user via Supabase Auth.
   * Used in AuthView.tsx
   */
  async signUp(email: string, password: string, name: string): Promise<UserProfile> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });

    if (error) throw error;

    // After sign up, we initialize a mock profile until they connect a wallet
    this.user = {
      id: data.user?.id || crypto.randomUUID(),
      address: '0x0000000000000000000000000000000000000000',
      name: name,
      email: email,
      kycStatus: 'approved',
      tier: 'BASIC',
      createdAt: Date.now(),
      fiatBalance: 0
    };
    return this.user;
  }

  /**
   * Signs in an existing user via Supabase Auth.
   * Used in AuthView.tsx
   */
  async signIn(email: string, password: string): Promise<UserProfile> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // If successful, we return a mock profile or fetch from users table if it exists
    return this.authenticate('0x0000000000000000000000000000000000000000', 'login-session');
  }

  // --- Módulo Indexer Database ---
  
  async saveOnChainSwap(swap: Trade) {
    // Persiste o trade no Supabase para que todos os usuários vejam o mesmo histórico
    await supabase.from('transactions').insert({
      tx_hash: swap.hash,
      user_id: this.user?.id,
      amount: parseFloat(swap.amount),
      type: swap.type === 'BUY' ? 'swap' : 'swap',
      status: 'confirmed',
      metadata: { price: swap.price, timestamp: swap.time }
    });
  }

  async getGlobalTradeHistory(): Promise<Trade[]> {
    // Busca os trades indexados do banco de dados
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('type', 'swap')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (!data) return [];
    
    return data.map(tx => ({
      hash: tx.tx_hash,
      type: (tx.metadata as any)?.price > 2450 ? 'BUY' : 'SELL', // Simplificação lógica
      amount: tx.amount.toString(),
      price: (tx.metadata as any)?.price || 2450,
      time: (tx.metadata as any)?.timestamp || new Date(tx.created_at).getTime() / 1000
    }));
  }

  async processFiatTransaction(amount: number, type: 'on_ramp' | 'off_ramp'): Promise<boolean> {
    if (!this.user) return false;
    if (type === 'on_ramp') this.user.fiatBalance += amount;
    else this.user.fiatBalance -= amount;
    
    await supabase.from('audit_logs').insert({ user_id: this.user.id, action: `FIAT_${type.toUpperCase()}`, metadata: { amount } });
    return true;
  }

  getUser() { return this.user; }
  logout() { this.user = null; supabase.auth.signOut(); }
}

export const backendApi = new BackendService();

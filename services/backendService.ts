
import { UserProfile, KYCStatus, KYCRecord, AssetRecord, BalanceRecord, TransactionRecord, PoolRecord, UserLiquidityRecord, FiatTransactionRecord, AuditLogRecord } from '../types.ts';
import { supabase } from './supabaseClient.ts';

class BackendService {
  private user: UserProfile | null = null;
  public isDatabaseDegraded = false;

  /**
   * Robust error stringification to avoid [object Object]
   * specifically designed for native Errors and Supabase/Postgrest responses.
   */
  private stringifyError(err: any): string {
    if (!err) return "Unknown error";
    if (typeof err === 'string') return err;
    
    // Attempt to extract standard message properties
    const message = err.message || err.details || err.hint;
    if (message && typeof message === 'string') return message;
    
    // Fallback to robust stringification
    try {
      if (err instanceof Error) return err.message;
      // Object.getOwnPropertyNames captures non-enumerable properties like 'message'
      return JSON.stringify(err, Object.getOwnPropertyNames(err));
    } catch (e) {
      return String(err);
    }
  }

  async authenticate(address: string, signature: string): Promise<UserProfile> {
    console.log(`[GARRETT] Real On-Chain Auth: ${address}`);
    
    try {
      // 1. Fetch user profile from Supabase
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('address', address) 
        .maybeSingle();

      if (fetchError) {
        this.isDatabaseDegraded = true;
        throw fetchError;
      }

      let latestKyc = null;
      if (userData) {
        const { data: kycData } = await supabase
          .from('kyc')
          .select('*')
          .eq('user_id', userData.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        latestKyc = kycData;
      }

      if (!userData) {
        // Dynamic profile creation for new real wallet connection
        this.user = {
          id: crypto.randomUUID(),
          address,
          name: 'Institutional Investor',
          email: `${address.slice(0, 6)}@garrett.io`,
          kycStatus: 'NOT_STARTED',
          tier: 'PRO',
          createdAt: Date.now()
        };
        
        // Audit log for new connection
        this.logAudit(this.user.id, 'WALLET_CONNECTED_NEW', { address }).catch(() => {});
      } else {
        this.user = this.mapProfile(userData, latestKyc, address);
        this.isDatabaseDegraded = false;
        this.logAudit(this.user.id, 'SESSION_RESTORED', { address }).catch(() => {});
      }
    } catch (err: any) {
      const errorDetail = this.stringifyError(err);
      console.warn(`[GARRETT] Auth system degraded: ${errorDetail}`);
      
      this.isDatabaseDegraded = true;
      // Fallback session when DB is unavailable or user doesn't exist yet
      this.user = {
        id: `offline-${address.slice(0, 8)}`,
        address,
        name: 'Investor (Offline Mode)',
        email: 'local@garrett.io',
        kycStatus: 'NOT_STARTED',
        tier: 'BASIC',
        createdAt: Date.now()
      };
    }

    return this.user!;
  }

  private async logAudit(userId: string, action: string, metadata: any) {
    try {
      const { error } = await supabase.from('audit_logs').insert({ user_id: userId, action, metadata });
      if (error) throw error;
    } catch (e) {
      console.debug('[GARRETT] Audit log failed (likely DB connection issue)');
    }
  }

  private mapProfile(db: any, kyc: any, address: string): UserProfile {
    return {
      id: db.id,
      address: address,
      name: db.full_name || 'Verified Member',
      email: db.email,
      phone: db.phone,
      country: db.country,
      kycStatus: (kyc?.status || 'NOT_STARTED') as KYCStatus,
      tier: (db.tier || 'BASIC') as any,
      createdAt: db.created_at ? new Date(db.created_at).getTime() : Date.now()
    };
  }

  async fetchAuditLogs(): Promise<AuditLogRecord[]> {
    if (!this.user || this.isDatabaseDegraded) return [];
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', this.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        action: item.action,
        metadata: item.metadata,
        createdAt: new Date(item.created_at).getTime()
      }));
    } catch (err) {
      return [];
    }
  }

  async registerTransaction(txHash: string, type: string, amount: number) {
    if (!this.user || this.isDatabaseDegraded) return;
    try {
      await supabase.from('transactions').insert({
        user_id: this.user.id,
        tx_hash: txHash,
        type,
        amount,
        status: 'confirmed'
      });
    } catch (e) {}
  }

  getUser() { return this.user; }
  logout() { this.user = null; }
}

export const backendApi = new BackendService();

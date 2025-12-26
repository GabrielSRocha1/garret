
import React from 'react';
import { Database, Terminal, ShieldCheck, Activity, Zap, Copy, Check, Link, ShieldAlert, Coins, Wallet, History, Droplets, Layers, CreditCard, SearchCode, Lock } from 'lucide-react';

const DatabaseView: React.FC = () => {
  const [copied, setCopied] = React.useState(false);
  
  const fullSqlSchema = `-- ==========================================
-- GARRETT FINTECH - MASTER SCHEMA V9
-- LAYER: SECURITY & DATA INTEGRITY
-- ==========================================

-- 1. Camada de Identidade
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text UNIQUE,
  phone text,
  country text,
  tier text DEFAULT 'BASIC',
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Camada de Compliance (KYC)
CREATE TABLE public.kyc (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  provider text,
  status text CHECK (status IN ('pending','approved','rejected')),
  external_id text,
  reviewed_at timestamp,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Catálogo de Ativos
CREATE TABLE public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text,
  name text,
  chain text,
  contract_address text,
  decimals int,
  type text CHECK (type IN ('crypto','fiat','lp')),
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Camada de Saldos
CREATE TABLE public.balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  asset_id uuid REFERENCES public.assets(id),
  amount numeric DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now()
);

-- 5. Histórico de Transações On-Chain
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  asset_id uuid REFERENCES public.assets(id),
  tx_hash text,
  type text CHECK (type IN ('deposit','withdraw','swap','fiat_in','fiat_out')),
  amount numeric,
  status text CHECK (status IN ('pending','confirmed','failed')),
  created_at timestamp with time zone DEFAULT now()
);

-- 6. Transações Fiat (On/Off Ramp)
CREATE TABLE public.fiat_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  provider text,
  amount numeric,
  currency text,
  type text CHECK (type IN ('on_ramp','off_ramp')),
  status text,
  created_at timestamp with time zone DEFAULT now()
);

-- 7. Audit Logs
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  action text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- 8. Gestão de Pools de Liquidez
CREATE TABLE public.pools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_a uuid REFERENCES public.assets(id),
  asset_b uuid REFERENCES public.assets(id),
  pool_address text,
  apy numeric,
  tvl numeric,
  created_at timestamp with time zone DEFAULT now()
);

-- 9. Posições de Liquidez do Usuário
CREATE TABLE public.user_liquidity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  pool_id uuid REFERENCES public.pools(id),
  lp_amount numeric,
  created_at timestamp with time zone DEFAULT now()
);

-- ==========================================
-- 10. SEGURANÇA: ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitando RLS em todas as tabelas críticas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiat_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_liquidity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pools ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO (SOLICITADO)
CREATE POLICY "Users can view own data" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own data" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users view own kyc record" 
ON public.kyc FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users view own balances" 
ON public.balances FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users view own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users view own fiat transactions" 
ON public.fiat_transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users view own audit logs" 
ON public.audit_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users view own liquidity positions" 
ON public.user_liquidity FOR SELECT 
USING (auth.uid() = user_id);

-- POLÍTICAS PÚBLICAS (READ-ONLY)
CREATE POLICY "Assets are viewable by everyone" 
ON public.assets FOR SELECT 
USING (true);

CREATE POLICY "Pools are viewable by everyone" 
ON public.pools FOR SELECT 
USING (true);`;

  const copySql = () => {
    navigator.clipboard.writeText(fullSqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-800/50 pb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            <Database className="text-emerald-500" size={32} />
            Fintech SQL Cluster
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">PostgreSQL v15.1 - Camada de Segurança e RLS Avançada.</p>
        </div>
        <button 
          onClick={copySql}
          className="bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-xs uppercase transition-all shadow-lg shadow-emerald-500/20"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? "SQL Copiado" : "Copiar SQL Schema"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/30">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-emerald-500" />
                <span className="text-xs font-black text-white uppercase tracking-widest">Migrations / Master_Schema_V9_RLS_Enforced.sql</span>
              </div>
            </div>
            <div className="p-8 bg-slate-950/50 font-mono text-[13px] text-slate-400 overflow-x-auto max-h-[600px] custom-scrollbar">
              <pre className="leading-relaxed">
                {fullSqlSchema}
              </pre>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0d0d0f] p-8 rounded-[32px] border border-slate-800/50">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-cyan-500" size={24} />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Segurança de Dados</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 flex items-center gap-3">
                <ShieldCheck size={16} className="text-emerald-500" />
                <div>
                  <p className="text-[10px] font-black text-white uppercase">Row Level Security</p>
                  <p className="text-[9px] text-slate-500">Isolamento total de usuários</p>
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 flex items-center gap-3">
                <History size={16} className="text-cyan-400" />
                <div>
                  <p className="text-[10px] font-black text-white uppercase">Audit Layer</p>
                  <p className="text-[9px] text-slate-500">Rastreio de modificações</p>
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 flex items-center gap-3">
                <ShieldAlert size={16} className="text-red-500" />
                <div>
                  <p className="text-[10px] font-black text-white uppercase">Zero Trust Access</p>
                  <p className="text-[9px] text-slate-500">Políticas granulares por tabela</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[24px]">
            <p className="text-[11px] text-emerald-500/80 font-medium leading-relaxed italic">
              "A política 'Users can view own data' garante que nenhum registro da tabela public.users seja exposto a terceiros sem autorização explícita do Supabase Auth."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseView;

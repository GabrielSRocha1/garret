
import React, { useState } from 'react';
import { FileCode, Shield, Lock, Eye, EyeOff, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EnvVar {
  key: string;
  value: string;
  description: string;
  isSecret: boolean;
  status: 'active' | 'rotated' | 'pending';
}

const INITIAL_ENV: EnvVar[] = [
  { key: 'API_CLUSTER_KEY', value: 'sk-garrett-prod-8239...x92', description: 'Chave de acesso ao cluster de balanceamento de carga.', isSecret: true, status: 'active' },
  { key: 'SUPABASE_SERVICE_ROLE', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Acesso administrativo ao banco de dados Supabase.', isSecret: true, status: 'active' },
  { key: 'FIREBLOCKS_API_USER', value: 'usr_92834710', description: 'Identificador do usuário de custódia MPC.', isSecret: false, status: 'active' },
  { key: 'NEXT_PUBLIC_CHAIN_ID', value: '137', description: 'ID da rede blockchain ativa (Polygon Mainnet).', isSecret: false, status: 'active' },
  { key: 'NEXT_PUBLIC_AMM_ADDRESS', value: '0x12c8b746...384b', description: 'Endereço do contrato Automated Market Maker da Garrett.', isSecret: false, status: 'active' },
  { key: 'CHAINLINK_NODE_URL', value: 'https://nodes.garrett.io/cl-mainnet', description: 'Endpoint do nó oráculo para feeds de preço.', isSecret: false, status: 'active' },
  { key: 'SENTINEL_AUDIT_SECRET', value: 'audit_0x7291a823...', description: 'Token de autenticação para o serviço Sentinel IA.', isSecret: true, status: 'rotated' },
];

const EnvView: React.FC = () => {
  const [envs, setEnvs] = useState<EnvVar[]>(INITIAL_ENV);
  const [showValues, setShowValues] = useState<{ [key: string]: boolean }>({});

  const toggleValue = (key: string) => {
    setShowValues(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-800/50 pb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            <FileCode className="text-cyan-500" size={32} />
            Environment Control
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Gestão de segredos e configurações de runtime do sistema.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
            <Shield className="text-cyan-500" size={18} />
            <div className="text-left">
              <p className="text-[9px] font-black text-slate-500 uppercase">Security Policy</p>
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">AES-256 Encrypted</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] mb-2">Active Variables</p>
          <div className="space-y-3">
            {envs.map((env) => (
              <div key={env.key} className="bg-[#0d0d0f] border border-slate-800/50 rounded-[28px] p-6 hover:border-slate-700 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
                      {env.isSecret ? <Lock size={16} className="text-amber-500" /> : <FileCode size={16} className="text-slate-500" />}
                    </div>
                    <div>
                      <h4 className="font-mono text-sm font-bold text-white uppercase tracking-tight">{env.key}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{env.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {env.status === 'rotated' && (
                      <span className="text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <AlertCircle size={10} /> Rotated
                      </span>
                    )}
                    {env.status === 'active' && (
                      <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <CheckCircle2 size={10} /> Sync
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between font-mono text-xs">
                    <span className={showValues[env.key] ? 'text-cyan-400' : 'text-slate-700'}>
                      {showValues[env.key] ? env.value : '••••••••••••••••••••••••••••••••'}
                    </span>
                    <button 
                      onClick={() => toggleValue(env.key)}
                      className="text-slate-600 hover:text-white transition-colors"
                    >
                      {showValues[env.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-all">
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-[#121215] to-[#0a0a0c] p-8 rounded-[32px] border border-slate-800/50">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Shield className="text-cyan-500" size={18} />
              Vault Health
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                  <span className="text-slate-500">Secrets Integrity</span>
                  <span className="text-emerald-500">100% Secure</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                  <span className="text-slate-500">Key Rotation Cycle</span>
                  <span className="text-cyan-500">12 Days Left</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[60%]"></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all">
              Initiate Manual Rotation
            </button>
          </div>

          <div className="p-6 bg-[#0d0d0f] rounded-[24px] border border-slate-800/50 flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
              <AlertCircle size={16} />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Alterações nestas variáveis exigem assinatura Multi-Sig do conselho de segurança da Garrett.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvView;
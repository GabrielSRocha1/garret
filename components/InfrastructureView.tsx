
import React from 'react';
import { Server, ShieldCheck, CreditCard, Activity, Database, Bell, Zap, Globe, Lock } from 'lucide-react';

const API_STACK = [
  { 
    name: 'Sumsub', 
    category: 'KYC / AML', 
    status: 'Connected', 
    latency: '124ms', 
    icon: ShieldCheck, 
    color: 'text-emerald-500',
    description: 'Verificação de identidade e monitoramento de sanções em tempo real.'
  },
  { 
    name: 'Fireblocks', 
    category: 'Custody / MPC', 
    status: 'Connected', 
    latency: '45ms', 
    icon: Lock, 
    color: 'text-cyan-500',
    description: 'Gestão de ativos via Multi-Party Computation e governança de cofre.'
  },
  { 
    name: 'Transak', 
    category: 'Fiat Ramp', 
    status: 'Active', 
    latency: '210ms', 
    icon: CreditCard, 
    color: 'text-amber-500',
    description: 'Conversão Fiat-to-Crypto via PIX, Débito e Transferência Bancária.'
  },
  { 
    name: 'Chainlink', 
    category: 'Price Oracles', 
    status: 'Synced', 
    latency: '12ms', 
    icon: Activity, 
    color: 'text-blue-500',
    description: 'Feeds de preço descentralizados e prova de reservas.'
  },
  { 
    name: 'The Graph', 
    category: 'Data Indexing', 
    status: 'Healthy', 
    latency: '8ms', 
    icon: Database, 
    color: 'text-purple-500',
    description: 'Indexação de eventos on-chain para analytics de alta performance.'
  },
  { 
    name: 'OneSignal', 
    category: 'Notifications', 
    status: 'Connected', 
    latency: '30ms', 
    icon: Bell, 
    color: 'text-red-500',
    description: 'Push dinâmico e alertas de transações críticas via Web/Mobile.'
  }
];

const InfrastructureView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">System Architecture</h2>
          <p className="text-slate-500 text-sm mt-1">Status operacional da camada de infraestrutura institucional.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Global Systems Nominal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {API_STACK.map((api) => (
          <div key={api.name} className="bg-[#0d0d0f] border border-slate-800/50 rounded-[32px] p-8 hover:border-slate-700 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 ${api.color}`}>
                <api.icon size={24} />
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 block mb-1">Status</span>
                <span className="text-xs font-bold text-white">{api.status}</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{api.name}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">{api.category}</p>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 h-12 overflow-hidden">{api.description}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
              <div className="flex items-center gap-2">
                <Zap size={12} className="text-cyan-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Latency</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400">{api.latency}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-cyan-600/5 to-blue-600/5 border border-cyan-500/20 rounded-[40px] p-10 mt-12">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500 text-[#0a0a0c] rounded-full text-[9px] font-black uppercase tracking-widest">
              VASP Compliance
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight leading-none">Certificações & Governança</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
              A arquitetura Garrett segue as diretrizes da <strong>FATF Travel Rule</strong> e auditorias <strong>SOC2 Type II</strong>. Todos os ativos são segregados e custodiados em ambientes isolados com backup geográfico.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="p-6 bg-[#0a0a0c] border border-slate-800 rounded-3xl text-center min-w-[140px]">
              <Globe className="text-slate-500 mx-auto mb-3" size={32} />
              <p className="text-[10px] font-black text-slate-400 uppercase">SLA</p>
              <p className="text-lg font-black text-white">99.99%</p>
            </div>
            <div className="p-6 bg-[#0a0a0c] border border-slate-800 rounded-3xl text-center min-w-[140px]">
              <Activity className="text-slate-500 mx-auto mb-3" size={32} />
              <p className="text-[10px] font-black text-slate-400 uppercase">Uptime</p>
              <p className="text-lg font-black text-white">453d</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureView;

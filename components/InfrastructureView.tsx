
import React, { useEffect, useState } from 'react';
import { Server, ShieldCheck, CreditCard, Activity, Database, Bell, Zap, Globe, Lock, Cpu, ArrowRight, Layers, Layout, Code2, Link, Binary } from 'lucide-react';
import { web3Service } from '../services/web3Provider.ts';

const SYSTEM_STACK = [
  { 
    id: 'frontend', 
    name: 'Frontend', 
    tech: 'React / Next.js', 
    icon: Layout, 
    color: 'text-blue-500', 
    desc: 'Interface institucional reativa com UX de alta performance e Sentinel Widgets.' 
  },
  { 
    id: 'backend', 
    name: 'Backend API', 
    tech: 'Node.js + NestJS', 
    icon: Server, 
    color: 'text-indigo-500', 
    desc: 'Orquestração de lógica de negócios, autenticação segura e gateway de banco de dados.' 
  },
  { 
    id: 'web3', 
    name: 'Web3 Layer', 
    tech: 'Ethers.js v6', 
    icon: Binary, 
    color: 'text-purple-500', 
    desc: 'Abstração de provedores RPC e integração com wallets via BrowserProvider.' 
  },
  { 
    id: 'contracts', 
    name: 'Smart Contracts', 
    tech: 'Solidity / EVM', 
    icon: Code2, 
    color: 'text-emerald-500', 
    desc: 'Lógica on-chain de AMM, Compliance Registry e Guardrails de liquidez.' 
  },
  { 
    id: 'chain', 
    name: 'Blockchain', 
    tech: 'L1/L2 Settlement', 
    icon: Database, 
    color: 'text-amber-500', 
    desc: 'Liquidação final em rede imutável (Ethereum, Polygon ou BNB Chain).' 
  }
];

const InfrastructureView: React.FC = () => {
  const [telemetry, setTelemetry] = useState({ blockNumber: 0, gasPrice: '0', latency: 0 });

  useEffect(() => {
    const sync = async () => {
      const status = await web3Service.getNetworkStatus();
      setTelemetry(status);
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/50 pb-8">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
            <Cpu className="text-cyan-500" size={36} />
            Institutional Stack
          </h2>
          <p className="text-slate-500 text-sm mt-1">Arquitetura fim-a-fim da infraestrutura Garrett Wealth.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase">System Integrity: Nominal</span>
          </div>
        </div>
      </div>

      {/* Vertical Stack Flow */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-4">
          {SYSTEM_STACK.map((layer, index) => (
            <div key={layer.id} className="relative">
              <div className="flex items-center gap-8 group">
                {/* Visual Connector Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner transition-all group-hover:border-slate-500 ${layer.color}`}>
                    <layer.icon size={24} />
                  </div>
                  {index < SYSTEM_STACK.length - 1 && (
                    <div className="w-0.5 h-12 bg-gradient-to-b from-slate-800 to-transparent my-1"></div>
                  )}
                </div>

                <div className="flex-1 bg-[#0d0d0f] border border-slate-800/50 p-6 rounded-[32px] hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-black text-white uppercase tracking-tight italic">{layer.name}</h3>
                      <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-800">
                        {layer.tech}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium max-w-lg leading-relaxed">{layer.desc}</p>
                  </div>
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-700 uppercase mb-1">Status</span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Connected</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Telemetry Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0d0d0f] border border-cyan-500/20 rounded-[40px] p-8 shadow-2xl shadow-cyan-500/5">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <Activity size={16} className="text-cyan-500" /> RPC Telemetry
            </h3>
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Confirmed Blocks</p>
                <p className="text-3xl font-black text-white italic">#{telemetry.blockNumber}</p>
                <div className="h-1 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[70%] animate-pulse"></div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Engine Latency</p>
                <p className="text-3xl font-black text-emerald-500 italic">{telemetry.latency}ms</p>
                <p className="text-[9px] text-slate-700 uppercase font-black mt-1">Read-Provider Response</p>
              </div>
              <div className="pt-8 border-t border-slate-800/50">
                <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-purple-500" />
                    <span className="text-[10px] font-black text-white uppercase">Mainnet Node</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Polygon</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/30 p-8 rounded-[32px] border border-slate-800/50 flex items-start gap-4">
            <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
            <p className="text-xs text-slate-500 leading-relaxed">
              O backend Garrett monitora constantemente o estado da blockchain via <strong>readProvider</strong>, garantindo que os dados do dashboard estejam sempre sincronizados, independente da conexão da wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureView;

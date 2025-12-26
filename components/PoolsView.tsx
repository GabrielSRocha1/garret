
import React from 'react';
import { Plus, TrendingUp, Droplets, Zap, ShieldCheck } from 'lucide-react';
import { Pool } from '../types.ts';

const PoolsView: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Institutional Staking</h2>
          <p className="text-slate-500 text-sm font-medium">Verify on-chain yields and protocol liquidity depth.</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-white text-[#0a0a0c] rounded-[24px] font-black text-xs uppercase tracking-widest transition-transform hover:scale-105 shadow-xl">
          <Plus size={20} /> Open Position
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0d0d0f] p-8 rounded-[32px] border border-slate-800/50">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Total Value Locked</p>
          <p className="text-3xl font-black text-white">$ --.--</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 text-xs font-bold">
            <ShieldCheck size={14} /> Verified APR
          </div>
        </div>
        <div className="bg-[#0d0d0f] p-8 rounded-[32px] border border-slate-800/50">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Active Liquidity</p>
          <p className="text-3xl font-black text-white">$ 0.00</p>
          <div className="mt-4 flex items-center gap-2 text-cyan-500 text-xs font-bold">
            <Droplets size={14} /> 0 Active Pools
          </div>
        </div>
        <div className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 p-8 rounded-[32px] border border-cyan-500/20 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Governance Boost</p>
            <p className="text-xl font-black text-white uppercase italic">Level 1</p>
          </div>
          <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-500">
            <Zap size={24} fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="bg-[#0d0d0f] rounded-[40px] border border-slate-800/50 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800/50 text-slate-600 text-[10px] uppercase font-black tracking-[0.3em] bg-slate-900/20">
              <th className="px-10 py-6">Asset Pair</th>
              <th className="px-10 py-6">TVL Depth</th>
              <th className="px-10 py-6">Real APR</th>
              <th className="px-10 py-6">Status</th>
              <th className="px-10 py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
             <tr className="group">
               <td className="px-10 py-20 text-center col-span-5 text-slate-700 font-black text-[10px] uppercase tracking-widest">
                  Scanning Smart Contracts for active pools...
               </td>
             </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PoolsView;

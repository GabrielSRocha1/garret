
import React from 'react';
import { Plus, TrendingUp, Droplets, Zap } from 'lucide-react';
import { Pool } from '../types.ts';

const MOCK_POOLS: Pool[] = [
  { id: '1', pair: 'ETH / USDC', tvl: 45000000, apr: 12.4, volume24h: 1200000, myLiquidity: 5400 },
  { id: '2', pair: 'POL / ETH', tvl: 12000000, apr: 24.8, volume24h: 450000, myLiquidity: 0 },
  { id: '3', pair: 'WBTC / USDC', tvl: 89000000, apr: 6.2, volume24h: 3400000, myLiquidity: 0 },
];

const PoolsView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Yield Pools</h2>
          <p className="text-slate-500 text-sm">Providencie liquidez e ganhe taxas de negociação.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#0a0a0c] rounded-2xl font-bold transition-transform hover:scale-105">
          <Plus size={20} /> Criar Posição
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0d0d0f] p-6 rounded-[32px] border border-slate-800/50">
          <p className="text-slate-500 text-xs font-bold uppercase mb-2">Seu Yield Total</p>
          <p className="text-3xl font-black text-white">$142.50</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 text-xs font-bold">
            <TrendingUp size={14} /> +12.4% este mês
          </div>
        </div>
        <div className="bg-[#0d0d0f] p-6 rounded-[32px] border border-slate-800/50">
          <p className="text-slate-500 text-xs font-bold uppercase mb-2">Liquidez Ativa</p>
          <p className="text-3xl font-black text-white">$5,400.00</p>
          <div className="mt-4 flex items-center gap-2 text-cyan-500 text-xs font-bold">
            <Droplets size={14} /> 1 Pool Ativa
          </div>
        </div>
        <div className="bg-[#0d0d0f] p-6 rounded-[32px] border border-slate-800/50 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase mb-2">Garrett Boost</p>
            <p className="text-xl font-bold text-slate-300">Nível 2 Ativado</p>
          </div>
          <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500">
            <Zap size={24} fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800/50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
              <th className="px-8 py-6">Par de Ativos</th>
              <th className="px-8 py-6">TVL</th>
              <th className="px-8 py-6">APR</th>
              <th className="px-8 py-6">Volume 24h</th>
              <th className="px-8 py-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {MOCK_POOLS.map((pool) => (
              <tr key={pool.id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#0d0d0f] z-10"></div>
                      <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#0d0d0f]"></div>
                    </div>
                    <span className="font-bold text-white">{pool.pair}</span>
                    {pool.myLiquidity > 0 && <span className="bg-cyan-500/10 text-cyan-500 text-[10px] px-2 py-0.5 rounded-full font-bold">Minha Posição</span>}
                  </div>
                </td>
                <td className="px-8 py-6 text-slate-300 font-medium">${(pool.tvl / 1000000).toFixed(1)}M</td>
                <td className="px-8 py-6">
                  <span className="text-emerald-500 font-bold">{pool.apr}%</span>
                </td>
                <td className="px-8 py-6 text-slate-400 text-sm">${(pool.volume24h / 1000).toFixed(0)}k</td>
                <td className="px-8 py-6 text-right">
                  <button className="px-4 py-2 bg-slate-800 group-hover:bg-cyan-500 group-hover:text-[#0a0a0c] rounded-xl text-xs font-black transition-all">
                    Depositar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PoolsView;

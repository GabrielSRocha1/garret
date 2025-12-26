
import React, { useState } from 'react';
import { ArrowDown, RefreshCcw, Settings2, Info, ChevronDown, Loader2, CheckCircle } from 'lucide-react';
import { web3Service } from '../services/web3Provider.ts';

const SwapView: React.FC = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    setLoading(true);
    setTxHash(null);
    try {
      const hash = await web3Service.executeSwap(fromAmount, true);
      setTxHash(hash);
      setFromAmount('');
    } catch (err: any) {
      alert("Swap failed: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 animate-in fade-in duration-500">
      <div className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Instant Swap</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400"><RefreshCcw size={18} /></button>
            <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400"><Settings2 size={18} /></button>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800/50 focus-within:border-cyan-500/50 transition-all mb-2">
          <div className="flex justify-between text-[10px] text-slate-500 mb-3 font-black uppercase tracking-widest">
            <span>Input Asset</span>
            <span>Balance: Active</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="bg-transparent border-none outline-none text-3xl font-black text-white w-full placeholder:text-slate-800"
            />
            <button className="flex items-center gap-2 bg-slate-800 px-4 py-2.5 rounded-xl text-white font-black text-xs uppercase tracking-widest border border-slate-700">
              POL <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-[47%] z-10 bg-[#0d0d0f] p-2 rounded-xl border border-slate-800 text-cyan-500 shadow-xl">
          <ArrowDown size={20} />
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800/50 focus-within:border-cyan-500/50 transition-all">
          <div className="flex justify-between text-[10px] text-slate-500 mb-3 font-black uppercase tracking-widest">
            <span>Estimated Output</span>
            <span>Price Impact: 0.05%</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              placeholder="0.00"
              readOnly
              className="bg-transparent border-none outline-none text-3xl font-black text-white w-full placeholder:text-slate-800"
            />
            <button className="flex items-center gap-2 bg-slate-800 px-4 py-2.5 rounded-xl text-white font-black text-xs uppercase tracking-widest border border-slate-700">
              USDC <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {txHash && (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 animate-in zoom-in duration-300">
            <CheckCircle className="text-emerald-500" size={20} />
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase">Transaction Confirmed</p>
              <p className="text-[10px] text-slate-500 font-mono truncate w-48">{txHash}</p>
            </div>
          </div>
        )}

        <button 
          onClick={handleSwap}
          disabled={loading || !fromAmount}
          className="w-full py-5 mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-[#0a0a0c] rounded-[24px] font-black transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCcw size={18} />}
          {loading ? "Confirming On-Chain..." : "Confirm Institutional Swap"}
        </button>
      </div>

      <div className="bg-[#0d0d0f]/50 rounded-[24px] p-4 border border-slate-800/50 flex items-center gap-3">
        <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Info size={16} /></div>
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
          Transactions are routed through Garrett V3 AMM Liquidity Pools. Gas fees are calculated in native network tokens.
        </p>
      </div>
    </div>
  );
};

export default SwapView;

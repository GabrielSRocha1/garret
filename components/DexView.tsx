
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowDown, RefreshCcw, Settings2, ChevronDown, 
  Loader2, CheckCircle, ShieldCheck, Zap, Activity, 
  History, Info, TrendingUp, TrendingDown, ArrowUpRight,
  Maximize2, BarChart3, ArrowRightLeft, Coins, Globe
} from 'lucide-react';
import { web3Service } from '../services/web3Provider.ts';
import { indexer } from '../services/indexerService.ts';
import { Candle, Trade } from '../types.ts';

const DexView: React.FC = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState(indexer.getMarketStats());
  const [orderMode, setOrderMode] = useState<'BUY' | 'SELL'>('BUY');
  const [timeframe, setTimeframe] = useState('1m');

  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(indexer.getCandles());
      setTrades(indexer.getRecentTrades());
      setStats(indexer.getMarketStats());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleExecuteTrade = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    setLoading(true);
    setTxHash(null);
    try {
      const hash = await web3Service.executeSwap(fromAmount, orderMode === 'BUY');
      setTxHash(hash);
      setFromAmount('');
    } catch (err: any) {
      console.error(err);
      alert("Execution Failed: Verify slippage or balance.");
    } finally {
      setLoading(false);
    }
  };

  const { maxVal, minVal } = useMemo(() => {
    const visible = candles.slice(-60);
    if (visible.length === 0) return { maxVal: 2500, minVal: 2400 };
    const h = Math.max(...visible.map(c => c.high));
    const l = Math.min(...visible.map(c => c.low));
    const padding = (h - l) * 0.15;
    return { maxVal: h + padding, minVal: l - padding };
  }, [candles]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 h-full min-h-[85vh] pb-10">
      
      {/* Esquerda: Gráfico de Velas Professional */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Header de Mercado Sincronizado */}
        <div className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 p-6 flex flex-wrap items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50"></div>
          
          <div className="flex items-center gap-5">
            <div className="flex -space-x-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 border-4 border-[#0a0a0c] flex items-center justify-center text-[10px] font-black text-black">ETH</div>
              <div className="w-12 h-12 rounded-full bg-cyan-500 border-4 border-[#0a0a0c] flex items-center justify-center text-[10px] font-black text-black">G</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white italic tracking-tighter">GARRETT / ETH</h3>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${stats.change24h >= 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                  {stats.change24h >= 0 ? '+' : ''}{stats.change24h.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Chain Feed</p>
              </div>
            </div>
          </div>

          <div className="flex gap-10">
            <div className="text-center sm:text-left">
              <p className="text-[9px] text-slate-600 font-black uppercase mb-1 tracking-widest">Latest Price</p>
              <p className="text-2xl font-black text-white font-mono tracking-tighter">
                {stats.price.toLocaleString(undefined, { minimumFractionDigits: 5 })} <span className="text-xs text-slate-600 font-bold">ETH</span>
              </p>
            </div>
            <div className="hidden md:block">
              <p className="text-[9px] text-slate-600 font-black uppercase mb-1 tracking-widest">24h Aggregated Volume</p>
              <p className="text-2xl font-black text-cyan-500 font-mono tracking-tighter">
                {stats.volume24h.toFixed(2)} <span className="text-xs">ETH</span>
              </p>
            </div>
          </div>
        </div>

        {/* Trading Terminal Chart Container */}
        <div className="bg-[#0d0d0f] rounded-[40px] border border-slate-800/50 flex-1 flex flex-col overflow-hidden shadow-2xl group relative">
          <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/20">
             <div className="flex gap-1">
               {['1m', '5m', '15m', '1h', '4h'].map(t => (
                 <button 
                  key={t} 
                  onClick={() => setTimeframe(t)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${timeframe === t ? 'bg-white text-black' : 'text-slate-600 hover:text-slate-300'}`}
                 >
                   {t}
                 </button>
               ))}
             </div>
             <div className="flex items-center gap-4">
                <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"><BarChart3 size={16}/></button>
                <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"><Settings2 size={16}/></button>
             </div>
          </div>

          <div className="flex-1 relative p-10 flex items-end gap-[2px]">
            {/* Price Y-Axis Labels */}
            <div className="absolute right-0 top-0 bottom-0 w-16 border-l border-slate-800/30 flex flex-col justify-between py-12 px-2 font-mono text-[9px] text-slate-700 pointer-events-none z-20 bg-[#0d0d0f]/20 backdrop-blur-sm">
               {[maxVal, (maxVal + minVal) / 2, minVal].map((p, i) => (
                 <span key={i}>{p.toFixed(4)}</span>
               ))}
            </div>

            {/* Grid Lines */}
            <div className="absolute inset-0 p-10 flex flex-col justify-between pointer-events-none opacity-5">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-white"></div>)}
            </div>

            {/* Candle Plotting */}
            <div className="flex-1 h-full flex items-end gap-[1.5px] z-10">
              {candles.slice(-70).map((c, i) => {
                const range = maxVal - minVal;
                const hHeight = ((c.high - c.low) / range) * 100;
                const bBottom = ((Math.min(c.open, c.close) - minVal) / range) * 100;
                const bHeight = Math.max(1, (Math.abs(c.close - c.open) / range) * 100);
                const isUp = c.close >= c.open;
                
                return (
                  <div key={c.time} className="flex-1 flex flex-col justify-end relative group/candle h-full">
                    {/* Wick */}
                    <div className={`absolute left-1/2 w-[1px] ${isUp ? 'bg-emerald-500/40' : 'bg-red-500/40'}`} style={{ height: `${hHeight}%`, bottom: `${((c.low - minVal) / range) * 100}%` }}></div>
                    {/* Body */}
                    <div className={`w-full relative z-10 transition-all ${isUp ? 'bg-emerald-500' : 'bg-red-500'} group-hover/candle:brightness-125 group-hover/candle:scale-x-110 shadow-lg`} style={{ height: `${bHeight}%`, bottom: `${bBottom}%` }}></div>
                    
                    {/* Professional Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-slate-900 border border-slate-700 p-3 rounded-xl text-[9px] font-mono hidden group-hover/candle:block z-50 whitespace-nowrap shadow-2xl animate-in fade-in zoom-in duration-200">
                      <p className="text-slate-400 mb-1 border-b border-slate-800 pb-1">{new Date(c.time * 1000).toLocaleTimeString()}</p>
                      <p className="text-white">O: {c.open.toFixed(5)}</p>
                      <p className="text-white">H: {c.high.toFixed(5)}</p>
                      <p className="text-white">L: {c.low.toFixed(5)}</p>
                      <p className={`font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>C: {c.close.toFixed(5)}</p>
                      <p className="text-cyan-500 mt-1">VOL: {c.volume.toFixed(2)} ETH</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-16 border-t border-slate-800/50 bg-slate-900/10 flex items-center px-10">
             <div className="flex gap-6 text-[10px] font-black uppercase text-slate-600 tracking-widest">
                {/* Fixed: Added missing Globe import to ensure icon renders correctly */}
                <span className="flex items-center gap-2"><Globe size={12}/> Ethereum Mainnet</span>
                <span className="text-cyan-500">Node: 0x328C...0a36</span>
                <span className="text-emerald-500 flex items-center gap-1"><Zap size={10}/> Instant Sync</span>
             </div>
          </div>
        </div>
      </div>

      {/* Direita: Terminal de Execução de Ordens */}
      <div className="w-full lg:w-[420px] flex flex-col gap-6">
        <div className="bg-[#0d0d0f] rounded-[48px] border border-slate-800/50 p-8 shadow-2xl flex flex-col h-full relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/5 blur-[100px] pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Trade Terminal</h2>
            <div className="bg-slate-900 p-1 rounded-2xl flex border border-slate-800">
              <button onClick={() => setOrderMode('BUY')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${orderMode === 'BUY' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-600'}`}>BUY</button>
              <button onClick={() => setOrderMode('SELL')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${orderMode === 'SELL' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-600'}`}>SELL</button>
            </div>
          </div>

          <div className="space-y-5 flex-1">
            {/* Input Asset */}
            <div className="bg-slate-900/40 rounded-[32px] p-6 border border-slate-800/50 focus-within:border-cyan-500/50 transition-all group">
               <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600 mb-4 tracking-widest">
                 <span>Amount to {orderMode === 'BUY' ? 'spend' : 'sell'}</span>
                 <span className="text-white">Bal: 1.42 {orderMode === 'BUY' ? 'ETH' : 'G'}</span>
               </div>
               <div className="flex items-center gap-4">
                 <input 
                  type="number" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.00" className="w-full bg-transparent border-none outline-none text-5xl font-black text-white placeholder:text-slate-900 tracking-tighter"
                 />
                 <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-black text-slate-400">
                   {orderMode === 'BUY' ? 'ETH' : 'GARRETT'}
                 </div>
               </div>
            </div>

            <div className="flex justify-center -my-6 relative z-10">
               <div className="bg-[#0a0a0c] p-3 rounded-2xl border border-slate-800 text-cyan-500 shadow-2xl transform hover:rotate-180 transition-transform cursor-pointer">
                <ArrowRightLeft size={24} className="rotate-90" />
               </div>
            </div>

            {/* Estimated Output */}
            <div className="bg-slate-900/40 rounded-[32px] p-6 border border-slate-800/50 opacity-80 group">
               <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600 mb-4 tracking-widest">
                 <span>Estimated Receive</span>
                 <span className="text-cyan-500 flex items-center gap-1"><Info size={10}/> Uniswap V2 Route</span>
               </div>
               <div className="flex items-center gap-4">
                 <p className="w-full text-5xl font-black text-white/40 tracking-tighter">
                  {fromAmount ? (parseFloat(fromAmount) * (orderMode === 'BUY' ? (1/stats.price) : stats.price)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                 </p>
                 <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-black text-slate-600">
                   {orderMode === 'BUY' ? 'G' : 'ETH'}
                 </div>
               </div>
            </div>

            {/* Trading Config */}
            <div className="grid grid-cols-2 gap-3 pt-4">
               <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-900">
                 <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Max Slippage</p>
                 <p className="text-xs font-bold text-white uppercase tracking-tighter">0.5% (Auto)</p>
               </div>
               <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-900">
                 <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Price Impact</p>
                 <p className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">&lt; 0.01%</p>
               </div>
            </div>
          </div>

          {txHash && (
            <div className="mt-6 p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center gap-4 animate-in zoom-in">
              <CheckCircle className="text-emerald-500" size={24} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Transaction Confirmed</p>
                <p className="text-[9px] text-slate-500 font-mono truncate">{txHash}</p>
              </div>
            </div>
          )}

          <button 
            onClick={handleExecuteTrade}
            disabled={loading || !fromAmount}
            className={`w-full py-6 mt-8 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 ${
              orderMode === 'BUY' ? 'bg-emerald-500 text-black shadow-emerald-500/20 hover:bg-emerald-400' : 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-400'
            } disabled:bg-slate-800 disabled:text-slate-600`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
            {loading ? "Routing on-chain..." : `Confirm ${orderMode} Order`}
          </button>
        </div>

        {/* Histórico de Trades Sincronizado com Supabase */}
        <div className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 flex-1 flex flex-col overflow-hidden shadow-xl">
           <div className="px-6 py-4 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/20">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <History size={14}/> Recent Market Swaps
             </h4>
             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Live</span>
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
             {trades.map((t, i) => (
               <div key={t.hash + i} className="flex justify-between items-center text-[10px] font-mono p-4 hover:bg-slate-800/40 rounded-2xl transition-all border border-transparent hover:border-slate-700/50 group">
                 <div className="flex items-center gap-4">
                   <div className={`w-2 h-2 rounded-full ${t.type === 'BUY' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50'}`}></div>
                   <span className="text-white font-black">{parseFloat(t.amount).toFixed(4)} ETH</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="text-slate-500">@ {t.price.toFixed(5)}</span>
                   <ArrowUpRight size={12} className="text-slate-700 group-hover:text-cyan-500 transition-colors" />
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DexView;

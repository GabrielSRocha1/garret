
import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Droplets, Zap, ShieldCheck, Loader2, CheckCircle, ChevronRight, ShieldAlert, ArrowLeftRight, LogOut, Lock, Unlock, AlertCircle } from 'lucide-react';
import { web3Service } from '../services/web3Provider.ts';
import { backendApi } from '../services/backendService.ts';

const PoolsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [lpAmount, setLpAmount] = useState('');
  const [myLpBalance, setMyLpBalance] = useState('0.0');
  const [guardStatus, setGuardStatus] = useState({ paused: false, limit: '20' });
  
  const user = backendApi.getUser();
  const isKycApproved = user?.kycStatus === 'approved';

  useEffect(() => {
    const syncData = async () => {
      if (user?.address) {
        const [bal, guard] = await Promise.all([
          web3Service.getLPBalance(user.address),
          web3Service.getGuardState('0x12c8b746830c239828109847102938471029384b')
        ]);
        setMyLpBalance(bal);
        setGuardStatus(guard);
      }
    };
    syncData();
    const interval = setInterval(syncData, 15000);
    return () => clearInterval(interval);
  }, [user, txHash]);

  const handleAction = async () => {
    if (!isKycApproved || guardStatus.paused) return;
    setLoading(true);
    setTxHash(null);
    try {
      let hash;
      if (activeTab === 'add') {
        if (!amountA || !amountB) throw new Error("Please specify asset amounts.");
        hash = await web3Service.addLiquidity(amountA, amountB);
      } else {
        if (!lpAmount) throw new Error("Please specify LP burn amount.");
        hash = await web3Service.removeLiquidity(lpAmount);
      }
      setTxHash(hash);
      setAmountA('');
      setAmountB('');
      setLpAmount('');
    } catch (err: any) {
      console.error(err);
      alert("Operation rejected: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Institutional Staking</h2>
          <p className="text-slate-500 text-sm font-medium">Manage liquidity provisioning and exit strategies with AI Guardrails.</p>
        </div>
        <div className="flex gap-3">
          <div className={`px-4 py-2 rounded-xl flex items-center gap-3 border transition-all ${
            guardStatus.paused ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            {guardStatus.paused ? <Lock className="text-red-500" size={18} /> : <Unlock className="text-emerald-500" size={18} />}
            <div className="text-left">
              <span className={`text-[8px] font-black uppercase tracking-widest block leading-none ${guardStatus.paused ? 'text-red-500' : 'text-emerald-500'}`}>
                Liquidity Guard
              </span>
              <span className="text-[10px] font-bold text-white uppercase">{guardStatus.paused ? 'PAUSED' : 'ACTIVE'}</span>
            </div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-xl flex items-center gap-3">
            <Zap className="text-cyan-500" size={18} />
            <div className="text-left">
              <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest block leading-none">Max Exit</span>
              <span className="text-[10px] font-bold text-white uppercase">{guardStatus.limit}% / Period</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 p-8">
            <div className="flex bg-slate-900 p-1 rounded-2xl mb-8 w-fit">
              <button 
                onClick={() => setActiveTab('add')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'add' ? 'bg-white text-black' : 'text-slate-500'}`}
              >
                Deposit
              </button>
              <button 
                onClick={() => setActiveTab('remove')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'remove' ? 'bg-red-500 text-white' : 'text-slate-500'}`}
              >
                Exit Pool
              </button>
            </div>
            
            {activeTab === 'add' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-950 border border-slate-800/50 rounded-2xl p-6 space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Asset A (Native)</label>
                  <input 
                    type="number" value={amountA} onChange={(e) => setAmountA(e.target.value)}
                    placeholder="0.00" className="w-full bg-transparent border-none outline-none text-3xl font-black text-white"
                  />
                </div>
                <div className="bg-slate-950 border border-slate-800/50 rounded-2xl p-6 space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Asset B (Stable)</label>
                  <input 
                    type="number" value={amountB} onChange={(e) => setAmountB(e.target.value)}
                    placeholder="0.00" className="w-full bg-transparent border-none outline-none text-3xl font-black text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800/50 rounded-2xl p-8 mb-6 space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Burn LP Tokens</label>
                  <span className="text-[10px] font-bold text-cyan-500 uppercase">Balance: {myLpBalance} LP</span>
                </div>
                <input 
                  type="number" value={lpAmount} onChange={(e) => setLpAmount(e.target.value)}
                  placeholder="0.00" className="w-full bg-transparent border-none outline-none text-5xl font-black text-white text-center"
                />
              </div>
            )}

            <button 
              onClick={handleAction}
              disabled={loading || !isKycApproved || guardStatus.paused}
              className={`w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                activeTab === 'add' ? 'bg-white text-black' : 'bg-red-500 text-white'
              } disabled:bg-slate-800 disabled:text-slate-600 shadow-2xl`}
            >
              {loading ? <Loader2 className="animate-spin" /> : activeTab === 'add' ? <Plus size={18} /> : <LogOut size={18} />}
              {loading ? "TRANSACTING ON-CHAIN..." : guardStatus.paused ? "LIQUIDITY LOCKED BY GUARD" : activeTab === 'add' ? "Provision Liquidity" : "Initiate Secure Exit"}
            </button>
            
            {!isKycApproved && (
              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                <ShieldAlert className="text-amber-500" size={18} />
                <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">KYC REQUIRED FOR STAKING OPERATIONS</p>
              </div>
            )}
            
            {txHash && (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 overflow-hidden">
                <CheckCircle className="text-emerald-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Receipt Confirmed</p>
                  <p className="text-[10px] text-emerald-500/70 font-mono truncate">{txHash}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#0d0d0f] rounded-[40px] border border-slate-800/50 overflow-hidden">
            <div className="p-8 border-b border-slate-800/50 bg-slate-900/20 flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Institutional Pools</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-slate-500 uppercase">Live Pricing</span>
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800/30 text-slate-600 text-[9px] uppercase font-black tracking-[0.3em]">
                  <th className="px-10 py-5">Pair</th>
                  <th className="px-10 py-5">Total TVL</th>
                  <th className="px-10 py-5">Real Yield (APR)</th>
                  <th className="px-10 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/20">
                 <tr className="group hover:bg-slate-900/40 transition-colors">
                   <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#0a0a0c] flex items-center justify-center text-[8px] font-black">POL</div>
                          <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#0a0a0c] flex items-center justify-center text-[8px] font-black">USDC</div>
                        </div>
                        <span className="text-sm font-bold text-white italic">POL / USDC</span>
                      </div>
                   </td>
                   <td className="px-10 py-8 text-white font-mono text-sm">$ 2,410,592</td>
                   <td className="px-10 py-8 text-emerald-500 font-black">12.4%</td>
                   <td className="px-10 py-8 text-right">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Active</span>
                   </td>
                 </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0d0d0f] p-8 rounded-[32px] border border-slate-800/50">
             <div className="flex items-center gap-2 mb-4 text-slate-500">
                <TrendingUp size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Strategy Metrics</span>
             </div>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Global TVL (Garrett)</p>
            <p className="text-3xl font-black text-white tracking-tight">$ 8.24M</p>
          </div>
          <div className="bg-[#0d0d0f] p-8 rounded-[32px] border border-slate-800/50">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Your Portfolio Weight</p>
            <p className="text-3xl font-black text-cyan-500 tracking-tight">{myLpBalance} LP</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
               <ShieldCheck size={12} className="text-emerald-500" />
               Risk: Optimized
            </div>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-[32px] border border-slate-800/30">
            <div className="flex items-center gap-2 mb-3 text-amber-500">
               <AlertCircle size={14} />
               <span className="text-[9px] font-black uppercase tracking-widest">Security Notice</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              O módulo <strong>Liquidity Guard</strong> monitora anomalias on-chain. Saques que excedam 20% da liquidez total do pool em 24h serão pausados automaticamente para auditoria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolsView;

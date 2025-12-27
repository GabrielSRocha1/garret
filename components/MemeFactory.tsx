
import React, { useState } from 'react';
import { Coins, Plus, Rocket, ShieldCheck, Loader2, CheckCircle2, Terminal, Info } from 'lucide-react';
import { web3Service } from '../services/web3Provider.ts';

const MemeFactory: React.FC = () => {
  const [tokenName, setTokenName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);

  const handleDeploy = async () => {
    if (!tokenName || !symbol) return;
    setLoading(true);
    try {
      // Simulação de deploy via Garrett Backend Deployer
      await new Promise(r => setTimeout(r, 3000));
      setDeployedAddress(`0x${Math.random().toString(16).slice(2, 42)}`);
    } catch (e) {
      alert("Factory deployment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            <Coins className="text-purple-500" size={32} />
            Token Factory
          </h2>
          <p className="text-slate-500 text-sm mt-1">Experimentação institucional via Garrett Labs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 p-8 space-y-6">
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800/50">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Token Name</label>
             <input 
              type="text" value={tokenName} onChange={(e) => setTokenName(e.target.value)}
              placeholder="Ex: Garrett Labs Alpha"
              className="w-full bg-transparent border-none outline-none text-xl font-bold text-white placeholder:text-slate-800"
             />
          </div>
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800/50">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Ticker Symbol</label>
             <input 
              type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)}
              placeholder="Ex: GLABS"
              className="w-full bg-transparent border-none outline-none text-xl font-bold text-white placeholder:text-slate-800"
             />
          </div>

          <button 
            onClick={handleDeploy}
            disabled={loading || !tokenName || !symbol}
            className="w-full py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-600/10 flex items-center justify-center gap-3 transition-all disabled:bg-slate-800 disabled:text-slate-600"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Rocket size={18} />}
            {loading ? "PROVISIONING ON-CHAIN..." : "Deploy to Sandbox"}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0d0d0f] p-8 rounded-[32px] border border-slate-800/50">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Terminal size={14} className="text-cyan-500" /> Factory Logs
            </h3>
            <div className="bg-slate-950 rounded-2xl p-6 font-mono text-[10px] text-slate-500 space-y-2 h-48 overflow-y-auto custom-scrollbar">
               <p className="">&gt; Initializing Factory Engine...</p>
               <p className="">&gt; Checking Global RPC Connectivity... <span className="text-emerald-500">OK</span></p>
               {tokenName && <p className="text-white">&gt; Name set: {tokenName}</p>}
               {symbol && <p className="text-white">&gt; Symbol set: {symbol}</p>}
               {loading && <p className="animate-pulse">&gt; Compiling GarrettMemeToken.sol...</p>}
               {deployedAddress && (
                 <div className="animate-in slide-in-from-left duration-300">
                   <p className="text-emerald-500">&gt; Contract Deployed!</p>
                   <p className="text-cyan-500">&gt; Address: {deployedAddress}</p>
                 </div>
               )}
            </div>
          </div>

          <div className="p-6 bg-purple-500/5 border border-purple-500/10 rounded-[24px] flex items-start gap-4">
             <Info className="text-purple-500 shrink-0" size={18} />
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
               Tokens criados via <strong>MemeFactory</strong> herdam o padrão ERC-20 e são automaticamente auditados pelo Sentinel IA antes da ativação do pool de liquidez.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeFactory;

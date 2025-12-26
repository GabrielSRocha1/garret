
import React, { useState } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, ShieldCheck, Loader2, CheckCircle, Globe, Wallet } from 'lucide-react';
import { backendApi } from '../services/backendService.ts';

const FiatRampView: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [method, setMethod] = useState<'PIX' | 'CARD'>('PIX');
  const user = backendApi.getUser();

  const handleRamp = async (type: 'on_ramp' | 'off_ramp') => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 2000)); // Simulação gateway
      await backendApi.processFiatTransaction(parseFloat(amount), type);
      setSuccess(true);
      setAmount('');
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      alert("Fiat transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Institutional Fiat Ramp</h2>
        <p className="text-slate-500 text-sm mt-1">Conecte seu capital tradicional à economia on-chain.</p>
      </div>

      <div className="bg-[#0d0d0f] rounded-[40px] border border-slate-800/50 p-10 shadow-2xl relative overflow-hidden">
        <div className="flex bg-slate-900 p-1 rounded-2xl mb-8 w-fit mx-auto">
          <button onClick={() => setMethod('PIX')} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'PIX' ? 'bg-emerald-500 text-[#0a0a0c]' : 'text-slate-500'}`}>PIX / Instant</button>
          <button onClick={() => setMethod('CARD')} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'CARD' ? 'bg-emerald-500 text-[#0a0a0c]' : 'text-slate-500'}`}>Global Card</button>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Amount to Deposit (BRL)</p>
            <input 
              type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00" className="bg-transparent border-none outline-none text-5xl font-black text-white text-center w-full placeholder:text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleRamp('on_ramp')} disabled={loading} className="py-5 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
              {loading ? <Loader2 className="animate-spin" /> : <ArrowDownLeft size={18} />} On-Ramp
            </button>
            <button onClick={() => handleRamp('off_ramp')} disabled={loading} className="py-5 bg-slate-800 text-white rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-700 transition-all">
              <ArrowUpRight size={18} /> Off-Ramp
            </button>
          </div>
        </div>

        {success && (
          <div className="absolute inset-0 bg-[#0d0d0f]/90 flex flex-col items-center justify-center animate-in fade-in duration-300 backdrop-blur-sm">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-emerald-500/20">
              <CheckCircle className="text-white" size={40} />
            </div>
            <h3 className="text-xl font-black text-white uppercase italic">Transaction Confirmed</h3>
            <p className="text-slate-500 text-xs mt-2">Balanço reconciliado com sucesso no banco de dados.</p>
          </div>
        )}
      </div>

      <div className="bg-[#0d0d0f]/50 p-6 rounded-3xl border border-slate-800/50 flex items-center gap-4">
        <ShieldCheck className="text-emerald-500" size={24} />
        <div>
          <p className="text-[10px] font-black text-white uppercase tracking-widest">PCI-DSS & VASP Compliant</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold">Transações monitoradas via Sentinel IA.</p>
        </div>
      </div>
    </div>
  );
};

export default FiatRampView;

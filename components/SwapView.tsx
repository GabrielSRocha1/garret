
import React, { useState } from 'react';
import { ArrowDown, RefreshCcw, Settings2, Info, ChevronDown, Lock } from 'lucide-react';

const SwapView: React.FC = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  // Robust detection of simulation mode via process shim
  const isPreDeploy = (window as any).process?.env?.NEXT_PUBLIC_WEB3_MODE === 'predeploy';

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Swap</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400"><RefreshCcw size={18} /></button>
            <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400"><Settings2 size={18} /></button>
          </div>
        </div>

        {/* Input From */}
        <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50 focus-within:border-cyan-500/50 transition-all mb-2">
          <div className="flex justify-between text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
            <span>Vender</span>
            <span>Saldo: 1.45 ETH</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="bg-transparent border-none outline-none text-2xl font-bold text-white w-full placeholder:text-slate-700"
            />
            <button className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-xl text-white font-bold text-sm">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" className="w-5 h-5" alt="ETH" />
              ETH <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Divider Icon */}
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-[47%] z-10 bg-[#0d0d0f] p-2 rounded-xl border border-slate-800 text-cyan-500">
          <ArrowDown size={20} />
        </div>

        {/* Input To */}
        <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50 focus-within:border-cyan-500/50 transition-all">
          <div className="flex justify-between text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
            <span>Comprar</span>
            <span>Est.</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              placeholder="0.00"
              readOnly
              className="bg-transparent border-none outline-none text-2xl font-bold text-white w-full placeholder:text-slate-700"
            />
            <button className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-xl text-white font-bold text-sm">
              <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" className="w-5 h-5" alt="USDC" />
              USDC <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-500">Preço</span>
            <span className="text-slate-300">1 ETH = 2,645.20 USDC</span>
          </div>
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-500">Slippage Tolerance</span>
            <span className="text-cyan-400">0.5%</span>
          </div>
        </div>

        <button 
          disabled={isPreDeploy}
          className={`w-full py-4 mt-6 rounded-[24px] font-black transition-all shadow-xl flex items-center justify-center gap-2 group active:scale-95 ${
            isPreDeploy 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none' 
              : 'bg-cyan-500 hover:bg-cyan-400 text-[#0a0a0c] shadow-cyan-500/20'
          }`}
        >
          {isPreDeploy && <Lock size={16} />}
          {isPreDeploy ? "Swap Desabilitado (Simulação)" : "Confirmar Swap"}
        </button>
      </div>

      <div className="bg-[#0d0d0f]/50 rounded-[24px] p-4 border border-slate-800/50 flex items-center gap-3">
        <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Info size={16} /></div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          {isPreDeploy 
            ? "O motor de liquidez está em modo de leitura. Ative uma carteira institucional para realizar swaps reais."
            : "Garrett Smart Routing selecionou a melhor rota em 3 protocolos para minimizar o impacto no preço."}
        </p>
      </div>
    </div>
  );
};

export default SwapView;

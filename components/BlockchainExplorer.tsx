
import React, { useEffect, useState } from 'react';
import { History, ArrowRight, CheckCircle2, Loader2, ExternalLink, Globe } from 'lucide-react';
import { web3Service } from '../services/web3Provider.ts';

interface BlockchainExplorerProps {
  address: string;
}

const BlockchainExplorer: React.FC<BlockchainExplorerProps> = ({ address }) => {
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTxs = async () => {
      setLoading(true);
      const data = await web3Service.getRecentTransactions(address);
      setTxs(data);
      setLoading(false);
    };
    fetchTxs();
  }, [address]);

  return (
    <div className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 flex flex-col h-full overflow-hidden">
      <div className="p-8 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/20">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-3">
            <Globe size={22} className="text-cyan-500" />
            Live Network Monitor
          </h3>
          <p className="text-xs text-slate-500 mt-1">Sincronizado com o nó principal da rede.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">Ativo</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="animate-spin text-cyan-500" size={32} />
            <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Aguardando confirmação do bloco...</p>
          </div>
        ) : txs.length === 0 ? (
          <div className="text-center py-20">
            <History size={48} className="text-slate-800 mx-auto mb-4" />
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Nenhum evento recente nesta wallet</p>
            <p className="text-[10px] text-slate-700 mt-1">Transações aparecem aqui assim que confirmadas na rede.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {txs.map((tx: any, idx: number) => (
              <div key={idx} className="group bg-slate-900/40 hover:bg-slate-800/40 border border-slate-800/50 p-6 rounded-[24px] transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 size={24} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tight">On-Chain Interaction</p>
                      <p className="text-[10px] text-slate-500 font-mono">{tx.slice(0, 16)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">Confirmed</p>
                    <ExternalLink size={14} className="text-slate-600 ml-auto group-hover:text-cyan-500 transition-colors" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 border-t border-slate-800/50 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">HASH:</span>
                    <span className="text-cyan-500/50">{tx.slice(0, 24)}...</span>
                  </div>
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-[9px] uppercase font-black">Success</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainExplorer;

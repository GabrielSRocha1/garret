
import React, { useState } from 'react';
import { ShieldCheck, Zap, AlertTriangle, Loader2, BrainCircuit, RefreshCw } from 'lucide-react';
import { analyzePortfolioSecurity } from '../services/geminiService.ts';

interface PortfolioAnalyzerProps {
  assets: any[];
}

const PortfolioAnalyzer: React.FC<PortfolioAnalyzerProps> = ({ assets }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzePortfolioSecurity(assets);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 p-8 flex flex-col h-full group">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <BrainCircuit size={16} className="text-purple-500" /> Sentinel Risk AI
        </h3>
        <button 
          onClick={runAnalysis}
          disabled={loading}
          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white rounded-xl transition-all"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
        </button>
      </div>

      {!analysis ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-10">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
            <ShieldCheck size={32} className="text-purple-500/50" />
          </div>
          <div>
            <p className="text-sm font-bold text-white uppercase italic">Ready for Audit</p>
            <p className="text-[10px] text-slate-500 uppercase font-black mt-1">Execute Gemini Analysis</p>
          </div>
          <button 
            onClick={runAnalysis}
            className="px-6 py-2.5 bg-purple-500 hover:bg-purple-400 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
          >
            Start Monitoring
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Safety Score</p>
              <p className={`text-2xl font-black ${analysis.score > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{analysis.score}%</p>
            </div>
            <div className="h-10 w-px bg-slate-800"></div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Risk Profile</p>
              <p className="text-sm font-bold text-white uppercase">{analysis.riskLevel}</p>
            </div>
          </div>

          <div className="space-y-3">
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">IA Strategic Recommendations</p>
             {analysis.recommendations.map((rec: string, i: number) => (
               <div key={i} className="flex gap-3 text-xs text-slate-400 leading-relaxed">
                 <div className="mt-1 w-1 h-1 bg-purple-500 rounded-full shrink-0" />
                 {rec}
               </div>
             ))}
          </div>
          
          <div className="pt-4 border-t border-slate-800">
            <p className="text-[9px] text-slate-500 font-medium italic">
              "Análise gerada em tempo real via Gemini-3-Pro para o cluster institucional Garrett."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioAnalyzer;

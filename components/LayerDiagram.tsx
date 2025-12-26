
import React from 'react';
import { Layers, Server, Shield, Database, Cpu, ArrowDown } from 'lucide-react';

const STACK_LAYERS = [
  { id: 'frontend', name: 'Frontend', icon: Layers, desc: 'Next.js / React UI', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'backend', name: 'Backend API', icon: Server, desc: 'Node.js + NestJS', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { id: 'web3', name: 'Web3 Layer', icon: Shield, desc: 'Ethers.js / Web3.js', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'contract', name: 'Smart Contracts', icon: Cpu, desc: 'Solidity Logic', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'chain', name: 'Blockchain', icon: Database, desc: 'BNB / Polygon / Eth', color: 'text-amber-400', bg: 'bg-amber-400/10' },
];

interface LayerDiagramProps {
  activeLayer: string;
  onLayerClick: (id: string) => void;
  processingId?: string | null;
}

const LayerDiagram: React.FC<LayerDiagramProps> = ({ activeLayer, onLayerClick, processingId }) => {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {STACK_LAYERS.map((layer, index) => (
        <React.Fragment key={layer.id}>
          <button
            onClick={() => onLayerClick(layer.id)}
            className={`w-full max-w-md p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group relative overflow-hidden ${
              activeLayer === layer.id 
                ? `${layer.bg} border-${layer.color.split('-')[1]}-500 ring-2 ring-${layer.color.split('-')[1]}-500/20` 
                : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className={`p-3 rounded-lg ${layer.bg} ${layer.color}`}>
              <layer.icon size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-100">{layer.name}</h3>
              <p className="text-sm text-slate-400">{layer.desc}</p>
            </div>
            {processingId === layer.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]"></div>
            )}
          </button>
          {index < STACK_LAYERS.length - 1 && (
            <div className={`transition-colors duration-500 ${processingId ? 'text-blue-500 animate-pulse' : 'text-slate-700'}`}>
              <ArrowDown size={20} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LayerDiagram;

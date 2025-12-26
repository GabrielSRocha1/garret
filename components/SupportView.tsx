
import React from 'react';
import { Headset, MessageSquare, BookOpen, ExternalLink, Mail, Phone } from 'lucide-react';

const SupportView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-white tracking-tighter">Support Center</h2>
        <p className="text-slate-500">How can we assist your institutional operations today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 p-8 rounded-[32px] border border-cyan-500/20 group hover:border-cyan-500/40 transition-all cursor-pointer">
          <div className="p-4 bg-cyan-500 rounded-2xl w-fit mb-6 shadow-xl shadow-cyan-500/20">
            <MessageSquare className="text-[#0a0a0c]" size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Live Concierge</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Fale agora com um especialista em gestão de ativos Web3. Tempo médio de resposta: 2 min.</p>
          <button className="w-full py-3 bg-cyan-500 text-[#0a0a0c] rounded-xl font-black text-xs uppercase tracking-widest">Start Chat</button>
        </div>

        <div className="bg-[#0d0d0f] p-8 rounded-[32px] border border-slate-800/50 hover:border-slate-700 transition-all">
          <div className="p-4 bg-slate-800 rounded-2xl w-fit mb-6">
            <BookOpen className="text-slate-300" size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Knowledge Base</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Documentação completa sobre segurança de custódia e pools de liquidez.</p>
          <button className="w-full py-3 bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
            Explore Docs <ExternalLink size={14} />
          </button>
        </div>
      </div>

      <div className="bg-[#0d0d0f] p-8 rounded-[32px] border border-slate-800/50">
        <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em] text-slate-500">Direct Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50">
            <Mail className="text-cyan-500" size={20} />
            <div>
              <p className="text-xs font-bold text-white">Email Support</p>
              <p className="text-[10px] text-slate-500">priority@garrett.io</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50">
            <Phone className="text-cyan-500" size={20} />
            <div>
              <p className="text-xs font-bold text-white">Phone Support</p>
              <p className="text-[10px] text-slate-500">+1 (800) GARRETT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportView;

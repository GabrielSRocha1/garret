
import React, { useState } from 'react';
import { Lock, Mail, User, ShieldCheck, Loader2, Wallet, ArrowRight, Github } from 'lucide-react';
import { backendApi } from '../services/backendService.ts';

interface AuthViewProps {
  onSuccess: (user: any) => void;
  onWalletConnect: () => void;
  isConnecting: boolean;
}

const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onWalletConnect, isConnecting }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        const user = await backendApi.signUp(email, password, name);
        onSuccess(user);
      } else {
        const user = await backendApi.signIn(email, password);
        onSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao processar autenticação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-[#0d0d0f] border border-slate-800/50 rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
        
        {/* Lado Esquerdo - Info */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-r border-slate-800/50">
          <div>
            <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-8">
              <Lock className="text-[#0a0a0c]" size={24} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">
              A NOVA ERA DO <br/><span className="text-cyan-500 uppercase">PATRIMÔNIO</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              Gestão institucional de ativos Web3 com segurança MPC e inteligência artificial Sentinel.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-widest">
              <ShieldCheck size={16} className="text-emerald-500" /> AES-256 Bit Encryption
            </div>
            <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-widest">
              <ShieldCheck size={16} className="text-emerald-500" /> SOC2 Type II Compliant
            </div>
          </div>
        </div>

        {/* Lado Direito - Form */}
        <div className="p-8 md:p-12">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex bg-slate-900 p-1 rounded-xl">
              <button 
                onClick={() => setMode('login')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${mode === 'login' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Entrar
              </button>
              <button 
                onClick={() => setMode('signup')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${mode === 'signup' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Cadastrar
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: John Doe"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none" 
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha Segura</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none" 
                />
              </div>
            </div>

            {error && <p className="text-[10px] font-bold text-red-500 bg-red-500/10 p-2 rounded-lg text-center">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-[#0a0a0c] rounded-2xl font-black transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  {mode === 'login' ? 'Entrar no Sistema' : 'Criar Conta Institucional'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800/50"></div></div>
            <div className="relative flex justify-center"><span className="px-4 bg-[#0d0d0f] text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">OU ACESSO WEB3</span></div>
          </div>

          <button 
            onClick={onWalletConnect}
            disabled={isConnecting}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3"
          >
            {isConnecting ? <Loader2 size={18} className="animate-spin" /> : <Wallet size={18} />}
            Conectar Institutional Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;

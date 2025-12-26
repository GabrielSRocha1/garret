
import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequência de animação
    const t1 = setTimeout(() => setStep(1), 50);
    const t2 = setTimeout(() => setStep(2), 1200);
    const t3 = setTimeout(() => onComplete(), 2500);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0c] z-[100] flex flex-col items-center justify-center overflow-hidden">
      {/* Container Principal */}
      <div className={`transition-all duration-700 transform ${step >= 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-40'}`}>
        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-cyan-500/30 relative">
          <Lock className="text-white" size={32} />
          {step >= 2 && (
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-4 border-[#0a0a0c] animate-in zoom-in duration-300">
              <ShieldCheck className="text-white" size={14} />
            </div>
          )}
        </div>
      </div>
      
      {/* Texto Garrett */}
      <div className={`mt-8 text-center transition-all duration-500 ${step >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
        <h1 className="text-3xl font-black tracking-tighter text-white mb-1">GARRETT</h1>
        <p className="text-slate-600 font-bold tracking-[0.3em] text-[10px] uppercase">Wealth Engine</p>
      </div>

      {/* Barra de Progresso */}
      <div className="absolute bottom-16 w-32 h-0.5 bg-slate-900 rounded-full overflow-hidden">
        <div 
          className="h-full bg-cyan-500 transition-all duration-[2000ms] ease-out" 
          style={{ width: step >= 2 ? '100%' : '10%' }}
        ></div>
      </div>
      
      {/* Indicator de Sistema */}
      <div className="absolute bottom-6 flex items-center gap-2">
        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-[8px] text-slate-700 uppercase font-black tracking-widest">
          Secure Session Initializing
        </span>
      </div>
    </div>
  );
};

export default SplashScreen;

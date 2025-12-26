
import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Garantir que os passos ocorram mesmo se o navegador atrasar o frame inicial
    const timers = [
      setTimeout(() => setStep(1), 100), // Aparece quase instantaneamente
      setTimeout(() => setStep(2), 1500),
      setTimeout(() => onComplete(), 3000)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0c] z-[100] flex flex-col items-center justify-center">
      <div className={`transition-all duration-1000 transform ${step >= 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-cyan-500/40 relative">
          <Lock className="text-white" size={40} />
          {step >= 2 && (
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1 border-4 border-[#0a0a0c] animate-bounce">
              <ShieldCheck className="text-white" size={16} />
            </div>
          )}
        </div>
      </div>
      
      <div className={`mt-8 text-center transition-all duration-700 ${step >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h1 className="text-4xl font-black tracking-tighter text-white mb-2">GARRETT</h1>
        <p className="text-slate-500 font-medium tracking-widest text-xs uppercase">Institutional Web3 Wealth</p>
      </div>

      <div className="absolute bottom-12 w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
        <div 
          className="h-full bg-cyan-500 transition-all duration-[2500ms] ease-out" 
          style={{ width: step >= 2 ? '100%' : '10%' }}
        ></div>
      </div>
      
      {/* Texto de debug discreto caso algo trave */}
      <div className="absolute bottom-4 text-[8px] text-slate-800 uppercase font-black">
        Initializing Secure Environment...
      </div>
    </div>
  );
};

export default SplashScreen;

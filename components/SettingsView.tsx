
import React from 'react';
import { User, ShieldCheck, CreditCard, Bell, LogOut, ChevronRight, BadgeCheck } from 'lucide-react';
import { backendApi } from '../services/backendService.ts';

const SettingsView: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const user = backendApi.getUser();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-white tracking-tight">Account Settings</h2>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest transition-colors"
        >
          <LogOut size={16} /> Logout Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-[#0d0d0f] p-6 rounded-[32px] border border-slate-800/50 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-[24px] mx-auto mb-4 flex items-center justify-center text-slate-500 border border-slate-700">
              <User size={40} />
            </div>
            <h3 className="text-white font-bold">{user?.name}</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1">{user?.address.slice(0, 6)}...{user?.address.slice(-4)}</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">
              <BadgeCheck size={12} /> {user?.tier} Member
            </div>
          </div>

          <nav className="space-y-1">
            {['General', 'Security', 'Privacy', 'Notifications'].map((item) => (
              <button key={item} className="w-full text-left px-6 py-4 rounded-2xl text-slate-500 hover:bg-slate-800/40 hover:text-slate-200 transition-all font-bold text-xs uppercase tracking-widest">
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          <section className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 p-8">
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="text-cyan-500" size={20} /> Identity Verification (KYC)
            </h4>
            <div className="flex items-center justify-between p-6 bg-slate-900/50 rounded-2xl border border-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center">
                  <BadgeCheck size={24} />
                </div>
                <div>
                  <p className="text-white font-bold">Level 2 Verified</p>
                  <p className="text-xs text-slate-500">Unlimited swap and fiat transactions enabled.</p>
                </div>
              </div>
              <span className="text-emerald-500 text-[10px] font-black uppercase bg-emerald-500/10 px-3 py-1 rounded-lg">Active</span>
            </div>
          </section>

          <section className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 p-8">
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <CreditCard className="text-cyan-500" size={20} /> Connected Payment Methods
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white italic">VISA •••• 4242</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black">Default On-Ramp</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-600" />
              </div>
            </div>
            <button className="w-full mt-4 py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:border-slate-600 hover:text-slate-400 transition-all font-bold text-[10px] uppercase tracking-widest">
              + Add New Payment Method
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

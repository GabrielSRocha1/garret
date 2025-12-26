
import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  Repeat, 
  Lock,
  Search,
  LayoutDashboard,
  Menu,
  Bell,
  Cpu,
  Loader2,
  Plug,
  ShieldAlert,
  AlertTriangle,
  Download,
  Terminal,
  FileCode
} from 'lucide-react';
import { web3Service } from './services/web3Provider.ts';
import { backendApi } from './services/backendService.ts';
import ContractEditor from './components/ContractEditor.tsx';
import BlockchainExplorer from './components/BlockchainExplorer.tsx';
import SwapView from './components/SwapView.tsx';
import PoolsView from './components/PoolsView.tsx';
import SplashScreen from './components/SplashScreen.tsx';
import SettingsView from './components/SettingsView.tsx';
import SupportView from './components/SupportView.tsx';
import InfrastructureView from './components/InfrastructureView.tsx';
import DatabaseView from './components/DatabaseView.tsx';
import EnvView from './components/EnvView.tsx';
import { ChainNetwork, ViewState, UserProfile } from './types.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewState>('splash');
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [walletInfo, setWalletInfo] = useState<{ address: string; chain: ChainNetwork } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPreDeploy = (window as any).process?.env?.NEXT_PUBLIC_WEB3_MODE === 'predeploy';
  const isInstalled = web3Service.isInstalled();

  useEffect(() => {
    if (walletInfo) {
      web3Service.listenToEvents(
        (newAddr) => console.log("Conta alterada:", newAddr),
        (newChain) => console.log("Rede alterada:", newChain)
      );
    }
  }, [walletInfo]);

  const handleConnect = async () => {
    if (!isInstalled && !isPreDeploy) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    setError(null);
    try {
      const { address, chainId } = await web3Service.connect();
      const networkName = web3Service.getNetworkName(chainId);
      const signature = await web3Service.signAuthMessage("GARRETT_AUTH_SESSION_" + Date.now());
      const user = await backendApi.authenticate(address, signature);
      
      setCurrentUser(user);
      setWalletInfo({ address, chain: networkName });
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Falha na conexão.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = () => {
    backendApi.logout();
    setCurrentUser(null);
    setWalletInfo(null);
    setActiveTab('auth');
  };

  if (activeTab === 'splash') {
    return <SplashScreen onComplete={() => setActiveTab('auth')} />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0d0d0f] border border-slate-800/50 rounded-[40px] p-12 text-center shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-cyan-500/20">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">SECURE ACCESS</h1>
          <p className="text-slate-500 text-sm mb-10 font-medium">Garrett Institutional Wealth Management</p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase">
              <ShieldAlert size={18} /> {error}
            </div>
          )}

          <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-[#0a0a0c] rounded-[24px] font-black transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 group"
          >
            {isConnecting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Sincronizando Wallet...
              </>
            ) : (
              <>
                <Wallet size={20} className="group-hover:rotate-12 transition-transform" />
                Conectar Institutional Wallet
              </>
            )}
          </button>
          
          <p className="mt-8 text-[10px] text-slate-600 uppercase font-black tracking-[0.2em] flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" /> AES-256 E2EE Protected
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Total Balance</h2>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-black text-white tracking-tighter">$1,248,592.40</span>
                      <span className="text-emerald-500 font-bold text-sm bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <TrendingUp size={14} /> +4.2%
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white transition-all"><ArrowUpRight size={20} /></button>
                    <button 
                      onClick={() => setActiveTab('swap')} 
                      disabled={isPreDeploy}
                      className={`p-3 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 group active:scale-95 ${
                        isPreDeploy 
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none' 
                          : 'bg-cyan-500 hover:bg-cyan-400 text-[#0a0a0c] shadow-cyan-500/20'
                      }`}
                    >
                      {isPreDeploy ? <Lock size={20} /> : <Repeat size={20} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-white flex items-center gap-2 italic uppercase text-xs tracking-widest">
                        <Cpu className="text-cyan-500" size={16} /> Asset Allocation
                      </h3>
                      <button className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors">Details</button>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: 'Ethereum', symbol: 'ETH', color: 'bg-blue-500', pct: 65, val: '$811,585.06' },
                        { name: 'USD Coin', symbol: 'USDC', color: 'bg-cyan-500', pct: 25, val: '$312,148.10' },
                        { name: 'Polygon', symbol: 'POL', color: 'bg-purple-500', pct: 10, val: '$124,859.24' },
                      ].map((asset) => (
                        <div key={asset.symbol} className="group cursor-pointer">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-200 font-bold">{asset.name}</span>
                            <span className="text-slate-400">{asset.val}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                            <div className={`h-full ${asset.color} transition-all duration-1000`} style={{ width: `${asset.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-full">
                    <BlockchainExplorer address={walletInfo?.address || ''} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#0d0d0f] to-[#16161a] p-8 rounded-[40px] border border-slate-800/50 shadow-xl">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" /> Wealth Security
                  </h3>
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                        <Lock size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">MPC Custody</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black">Fireblocks V3 Active</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-2xl">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Real-time AML</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black">Sumsub Monitoring</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'wallet': return <BlockchainExplorer address={walletInfo?.address || ''} />;
      case 'swap': return <SwapView />;
      case 'pools': return <PoolsView />;
      case 'infrastructure': return <InfrastructureView />;
      case 'database': return <DatabaseView />;
      case 'security': return <div className="h-[calc(100vh-200px)]"><ContractEditor onDeploy={(code) => alert("Deploying...")} /></div>;
      case 'env': return <EnvView />;
      case 'settings': return <SettingsView onLogout={handleLogout} />;
      case 'support': return <SupportView />;
      default: return <div className="text-white">View {activeTab} is under development.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-slate-300 font-sans">
      <nav className="fixed top-0 left-0 right-0 h-20 bg-[#0a0a0c]/80 backdrop-blur-2xl border-b border-slate-800/30 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Lock className="text-white" size={20} />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">GARRETT</span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'swap', label: 'Swap', icon: Repeat },
              { id: 'pools', label: 'Yield', icon: TrendingUp },
              { id: 'security', label: 'Sentinel', icon: ShieldCheck },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ViewState)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-2 items-center gap-3 font-mono text-[10px]">
             <span className="text-slate-400">{walletInfo?.address.slice(0, 6)}...{walletInfo?.address.slice(-4)}</span>
             <span className="text-cyan-500 uppercase font-black">{walletInfo?.chain}</span>
          </div>
          <button onClick={() => setActiveTab('settings')} className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400"><Menu size={20} /></button>
        </div>
      </nav>
      <main className="pt-32 pb-20 px-8 max-w-[1600px] mx-auto min-h-screen">
        {renderContent()}
      </main>
      <div className="fixed bottom-8 left-8 flex gap-2 z-[60]">
         {[
           { id: 'infrastructure', icon: Plug, label: 'API STACK' },
           { id: 'database', icon: Terminal, label: 'SQL' },
           { id: 'env', icon: FileCode, label: 'ENV' }
         ].map((tool) => (
           <button
             key={tool.id}
             onClick={() => setActiveTab(tool.id as ViewState)}
             className={`p-3 rounded-2xl border transition-all flex items-center gap-2 group ${activeTab === tool.id ? 'bg-cyan-500 border-cyan-400 text-[#0a0a0c]' : 'bg-[#0d0d0f]/80 backdrop-blur-md border-slate-800/50 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}
           >
             <tool.icon size={18} />
             <span className="text-[10px] font-black uppercase tracking-widest overflow-hidden transition-all duration-300 w-0 group-hover:w-16 whitespace-nowrap">{tool.label}</span>
           </button>
         ))}
      </div>
    </div>
  );
};

export default App;

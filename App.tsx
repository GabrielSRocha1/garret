
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  Repeat, 
  Lock,
  LayoutDashboard,
  Menu,
  Cpu,
  Loader2,
  Plug,
  Terminal,
  FileCode
} from 'lucide-react';
import { web3Service } from './services/web3Provider.ts';
import { backendApi } from './services/backendService.ts';
import SplashScreen from './components/SplashScreen.tsx';
import AuthView from './components/AuthView.tsx';
import { ChainNetwork, ViewState, UserProfile } from './types.ts';

const ContractEditor = lazy(() => import('./components/ContractEditor.tsx'));
const BlockchainExplorer = lazy(() => import('./components/BlockchainExplorer.tsx'));
const SwapView = lazy(() => import('./components/SwapView.tsx'));
const PoolsView = lazy(() => import('./components/PoolsView.tsx'));
const SettingsView = lazy(() => import('./components/SettingsView.tsx'));
const SupportView = lazy(() => import('./components/SupportView.tsx'));
const InfrastructureView = lazy(() => import('./components/InfrastructureView.tsx'));
const DatabaseView = lazy(() => import('./components/DatabaseView.tsx'));
const EnvView = lazy(() => import('./components/EnvView.tsx'));

const ViewLoader = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] gap-4 animate-in fade-in duration-500">
    <div className="relative">
      <Loader2 className="animate-spin text-cyan-500" size={40} />
      <div className="absolute inset-0 blur-xl bg-cyan-500/20 animate-pulse"></div>
    </div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Decrypting On-Chain Data...</p>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewState>('splash');
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [walletInfo, setWalletInfo] = useState<{ address: string; chain: ChainNetwork } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isInstalled = web3Service.isInstalled();

  useEffect(() => {
    if (walletInfo) {
      web3Service.listenToEvents(
        (newAddr) => {
          setWalletInfo(prev => prev ? { ...prev, address: newAddr } : null);
        },
        (newChain) => {
          const name = web3Service.getNetworkName(BigInt(newChain));
          setWalletInfo(prev => prev ? { ...prev, chain: name } : null);
        }
      );
    }
  }, [walletInfo]);

  const handleWalletConnect = async () => {
    if (!isInstalled) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    setError(null);
    try {
      const { address, chainId } = await web3Service.connect();
      const networkName = web3Service.getNetworkName(chainId);
      
      // Assinatura REAL obrigatória para login
      const nonce = `GARRETT_${Date.now()}`;
      const signature = await web3Service.signAuthMessage(nonce);
      
      // Autenticação vinculada à wallet real
      const user = await backendApi.authenticate(address, signature);
      
      setCurrentUser(user);
      setWalletInfo({ address, chain: networkName });
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Wallet connection failed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
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
      <AuthView 
        onSuccess={handleAuthSuccess} 
        onWalletConnect={handleWalletConnect}
        isConnecting={isConnecting}
      />
    );
  }

  const renderContent = () => {
    return (
      <Suspense fallback={<ViewLoader />}>
        {(() => {
          switch (activeTab) {
            case 'dashboard':
              return (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3 space-y-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Live Portfolio</h2>
                          <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-black text-white tracking-tighter">
                              {walletInfo ? "Connected" : "$0.00"}
                            </span>
                            <span className="text-emerald-500 font-bold text-sm bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <TrendingUp size={14} /> On-Chain
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setActiveTab('swap')} className="p-4 bg-cyan-500 hover:bg-cyan-400 text-[#0a0a0c] rounded-2xl transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                            <Repeat size={18} /> Instant Swap
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 p-8">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-white flex items-center gap-2 italic uppercase text-xs tracking-widest">
                              <Cpu className="text-cyan-500" size={16} /> Asset Verification
                            </h3>
                          </div>
                          <div className="space-y-6">
                            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Native Balance</p>
                              <p className="text-xl font-bold text-white">{walletInfo?.address ? 'Querying...' : 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Identity</p>
                              <p className="text-xl font-bold text-cyan-500 uppercase">{walletInfo?.chain || 'Unknown'}</p>
                            </div>
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
                          <ShieldCheck size={14} className="text-emerald-500" /> Wallet Health
                        </h3>
                        <div className="space-y-6">
                          <div className="flex gap-4 items-start">
                            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                              <Lock size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">Active Session</p>
                              <p className="text-[10px] text-slate-500 uppercase font-black">Signature Verified</p>
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
            case 'security': return <div className="h-[calc(100vh-200px)]"><ContractEditor onDeploy={() => {}} /></div>;
            case 'env': return <EnvView />;
            case 'settings': return <SettingsView onLogout={handleLogout} />;
            case 'support': return <SupportView />;
            default: return <div className="text-white text-center py-20 uppercase font-black tracking-widest">View Not Linked</div>;
          }
        })()}
      </Suspense>
    );
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
              { id: 'dashboard', label: 'Portfolio', icon: LayoutDashboard },
              { id: 'swap', label: 'Swap', icon: Repeat },
              { id: 'pools', label: 'Staking', icon: TrendingUp },
              { id: 'security', label: 'Auditor', icon: ShieldCheck },
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
          {walletInfo && (
            <div className="hidden md:flex bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 items-center gap-3 font-mono text-[10px]">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-slate-400">{walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}</span>
               <span className="text-cyan-500 uppercase font-black">{walletInfo.chain}</span>
            </div>
          )}
          <button onClick={() => setActiveTab('settings')} className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400"><Menu size={20} /></button>
        </div>
      </nav>
      <main className="pt-32 pb-20 px-8 max-w-[1600px] mx-auto min-h-screen">
        {renderContent()}
      </main>
      <div className="fixed bottom-8 left-8 flex gap-2 z-[60]">
         {[
           { id: 'infrastructure', icon: Plug, label: 'STACK' },
           { id: 'database', icon: Terminal, label: 'DB' },
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

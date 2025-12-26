
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
  FileCode,
  CreditCard,
  BrainCircuit,
  Activity,
  Globe,
  Database,
  Link as LinkIcon,
  Coins,
  Server,
  Layers,
  AlertTriangle,
  RefreshCw,
  CandlestickChart
} from 'lucide-react';
import { web3Service } from './services/web3Provider.ts';
import { backendApi } from './services/backendService.ts';
import SplashScreen from './components/SplashScreen.tsx';
import AuthView from './components/AuthView.tsx';
import { ChainNetwork, ViewState, UserProfile } from './types.ts';
import PortfolioAnalyzer from './components/PortfolioAnalyzer.tsx';

const ContractEditor = lazy(() => import('./components/ContractEditor.tsx'));
const BlockchainExplorer = lazy(() => import('./components/BlockchainExplorer.tsx'));
const DexView = lazy(() => import('./components/DexView.tsx'));
const PoolsView = lazy(() => import('./components/PoolsView.tsx'));
const SettingsView = lazy(() => import('./components/SettingsView.tsx'));
const SupportView = lazy(() => import('./components/SupportView.tsx'));
const InfrastructureView = lazy(() => import('./components/InfrastructureView.tsx'));
const DatabaseView = lazy(() => import('./components/DatabaseView.tsx'));
const EnvView = lazy(() => import('./components/EnvView.tsx'));
const FiatRampView = lazy(() => import('./components/FiatRampView.tsx'));
const MemeFactory = lazy(() => import('./components/MemeFactory.tsx'));

const ViewLoader = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] gap-4 animate-in fade-in duration-500">
    <div className="relative">
      <Loader2 className="animate-spin text-cyan-500" size={40} />
      <div className="absolute inset-0 blur-xl bg-cyan-500/20 animate-pulse"></div>
    </div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Syncing Global State...</p>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewState | 'meme' | 'dex'>('splash');
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [walletInfo, setWalletInfo] = useState<{ address: string; chain: ChainNetwork; chainId: bigint } | null>(null);
  const [networkStats, setNetworkStats] = useState<{ blockNumber: number; gasPrice: string; latency: number } | null>(null);
  const [globalTVL, setGlobalTVL] = useState('0.00');
  const [networkError, setNetworkError] = useState<string | null>(null);

  useEffect(() => {
    const syncNetwork = async () => {
      const [status, tvl] = await Promise.all([
        web3Service.getNetworkStatus(),
        web3Service.getGlobalTVL()
      ]);
      setNetworkStats(status);
      setGlobalTVL(tvl);
    };
    
    syncNetwork();
    const interval = setInterval(syncNetwork, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (walletInfo) {
      web3Service.listenToEvents(
        (newAddr) => setWalletInfo(prev => prev ? { ...prev, address: newAddr } : null),
        (newChain) => {
          const chainId = BigInt(newChain);
          const name = web3Service.getNetworkName(chainId);
          setWalletInfo(prev => prev ? { ...prev, chain: name, chainId } : null);
          if (chainId !== web3Service.targetChainId) {
            setNetworkError(`WRONG_NETWORK: Switch to ${web3Service.getNetworkName(web3Service.targetChainId)}`);
          } else {
            setNetworkError(null);
          }
        }
      );
    }
  }, [walletInfo]);

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    setNetworkError(null);
    try {
      const { address, chainId } = await web3Service.connect();
      const networkName = web3Service.getNetworkName(chainId);
      const nonce = `GARRETT_SESSION_${Date.now()}`;
      const signature = await web3Service.signAuthMessage(nonce);
      const user = await backendApi.authenticate(address, signature);
      setCurrentUser(user);
      setWalletInfo({ address, chain: networkName, chainId });
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error("[GARRETT] Auth Failed:", err);
      if (err.message?.includes("WRONG_NETWORK")) {
        setNetworkError(err.message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSwitchNetwork = async () => {
    setIsConnecting(true);
    const success = await web3Service.switchNetwork(web3Service.targetChainId);
    if (success) {
      setNetworkError(null);
    }
    setIsConnecting(false);
  };

  if (activeTab === 'splash') return <SplashScreen onComplete={() => setActiveTab('auth')} />;
  if (!currentUser) return <AuthView onSuccess={setCurrentUser} onWalletConnect={handleWalletConnect} isConnecting={isConnecting} />;

  const renderContent = () => (
    <Suspense fallback={<ViewLoader />}>
      {(() => {
        switch (activeTab) {
          case 'dashboard':
            return (
              <div className="space-y-8 animate-in fade-in duration-500">
                {networkError && (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-[32px] flex items-center justify-between gap-6 animate-bounce">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500">
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-tighter">Network Mismatch Detected</p>
                        <p className="text-xs text-amber-500/80 font-bold uppercase tracking-widest">{networkError}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleSwitchNetwork}
                      className="px-6 py-3 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-all"
                    >
                      <RefreshCw size={14} className={isConnecting ? "animate-spin" : ""} />
                      Switch to {web3Service.getNetworkName(web3Service.targetChainId)}
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3 space-y-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div>
                        <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Institutional Wealth</h2>
                        <div className="flex items-baseline gap-3">
                          <span className="text-5xl font-black text-white tracking-tighter">
                            R$ {(currentUser.fiatBalance + parseFloat(globalTVL) * 0.05).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-emerald-500 font-bold text-sm bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <TrendingUp size={14} /> +2.4%
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button onClick={() => setActiveTab('fiat')} className="flex-1 md:flex-none p-4 bg-white hover:bg-slate-200 text-[#0a0a0c] rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest">
                          <CreditCard size={18} /> Deposit Fiat
                        </button>
                        <button onClick={() => setActiveTab('dex')} className="flex-1 md:flex-none p-4 bg-cyan-500 hover:bg-cyan-400 text-[#0a0a0c] rounded-2xl transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest">
                          <CandlestickChart size={18} /> DEX Terminal
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-[#0d0d0f] rounded-[32px] border border-slate-800/50 p-8">
                        <h3 className="font-bold text-white flex items-center gap-2 italic uppercase text-xs tracking-widest mb-8">
                          <Activity className="text-cyan-500" size={16} /> Asset Verification
                        </h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex justify-between items-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase">Fiat Balance</p>
                            <p className="text-lg font-bold text-white">R$ {currentUser.fiatBalance.toFixed(2)}</p>
                          </div>
                          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex justify-between items-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase">On-Chain TVL (Global Node)</p>
                            <p className="text-lg font-bold text-cyan-500 uppercase">$ {parseFloat(globalTVL).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <BlockchainExplorer address={walletInfo?.address || ''} />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <PortfolioAnalyzer assets={[
                      { type: 'fiat', balance: currentUser.fiatBalance, currency: 'BRL' },
                      { type: 'wallet', chain: walletInfo?.chain || 'Mainnet', address: walletInfo?.address }
                    ]} />
                    
                    <div className="bg-gradient-to-br from-[#0d0d0f] to-[#16161a] p-8 rounded-[40px] border border-slate-800/50">
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" /> Sentinel Security
                      </h3>
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Lock size={20} /></div>
                          <div>
                            <p className="text-sm font-bold text-white">KYC Approved</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black">Gatekeeper Active</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-2xl"><Activity size={20} /></div>
                          <div>
                            <p className="text-sm font-bold text-white">MPC Vault</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black">Multi-Sig Guard</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          case 'fiat': return <FiatRampView />;
          case 'dex': return <DexView />;
          case 'pools': return <PoolsView />;
          case 'meme': return <MemeFactory />;
          case 'infrastructure': return <InfrastructureView />;
          case 'database': return <DatabaseView />;
          case 'security': return <div className="h-[calc(100vh-200px)]"><ContractEditor onDeploy={() => {}} /></div>;
          case 'env': return <EnvView />;
          case 'settings': return <SettingsView onLogout={() => { backendApi.logout(); setCurrentUser(null); setActiveTab('auth'); }} />;
          default: return <div className="text-white text-center py-20 uppercase font-black tracking-widest">Linked Module Not Found</div>;
        }
      })()}
    </Suspense>
  );

  return (
    <div className="min-h-screen bg-[#060608] text-slate-300 font-sans">
      <nav className="fixed top-0 left-0 right-0 h-20 bg-[#0a0a0c]/80 backdrop-blur-2xl border-b border-slate-800/30 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Lock className="text-white" size={20} /></div>
            <span className="text-xl font-black text-white tracking-tighter uppercase italic">Garrett</span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            {[
              { id: 'dashboard', label: 'Portfolio', icon: LayoutDashboard },
              { id: 'dex', label: 'DEX', icon: CandlestickChart },
              { id: 'pools', label: 'Staking', icon: TrendingUp },
              { id: 'meme', label: 'Labs', icon: Coins },
              { id: 'infrastructure', label: 'Stack', icon: Layers },
              { id: 'security', label: 'Auditor', icon: ShieldCheck },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Garrett Node</span>
            </div>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex flex-col">
                <span className="text-cyan-500">#{networkStats?.blockNumber || '---'}</span>
                <span className="text-[8px] text-slate-600 uppercase">Block</span>
              </div>
              <div className="flex flex-col">
                <span className="text-emerald-500">{networkStats?.latency || '--'}ms</span>
                <span className="text-[8px] text-slate-600 uppercase">Latency</span>
              </div>
            </div>
          </div>

          {walletInfo ? (
            <div className={`hidden md:flex bg-slate-900 border ${networkError ? 'border-amber-500 animate-pulse' : 'border-slate-800'} rounded-2xl px-4 py-2 items-center gap-3 font-mono text-[10px]`}>
               <div className={`w-2 h-2 ${networkError ? 'bg-amber-500' : 'bg-emerald-500'} rounded-full`}></div>
               <span className="text-slate-400">{walletInfo.address.slice(0, 6)}...</span>
               <span className={`${networkError ? 'text-amber-500' : 'text-cyan-500'} uppercase font-black`}>{walletInfo.chain}</span>
            </div>
          ) : (
            <button 
              onClick={handleWalletConnect}
              disabled={isConnecting}
              className="bg-white text-[#0a0a0c] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-colors"
            >
              {isConnecting ? <Loader2 size={14} className="animate-spin" /> : <Plug size={14} />}
              Connect Wallet
            </button>
          )}
          <button onClick={() => setActiveTab('settings')} className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400"><Menu size={20} /></button>
        </div>
      </nav>
      <main className={`pt-32 pb-20 px-8 ${activeTab === 'dex' ? 'max-w-full' : 'max-w-[1600px]'} mx-auto min-h-screen`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;

import { ethers } from 'ethers';
import { ChainNetwork } from '../types.ts';

class Web3ProviderService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  // Getter para verificar se estamos em modo de simulação institucional
  private get isPreDeployMode(): boolean {
    return (window as any).process?.env?.NEXT_PUBLIC_WEB3_MODE === "predeploy";
  }

  // No modo predeploy, consideramos "instalado" para habilitar o fluxo de demonstração
  public isInstalled(): boolean {
    if (this.isPreDeployMode) return true;
    return typeof window !== 'undefined' && !!(window as any).ethereum;
  }

  // Getter seguro para o objeto ethereum
  private get ethereum() {
    const eth = (window as any).ethereum;
    if (!eth) {
      // Se não houver ethereum e NÃO for predeploy, lançamos erro
      if (!this.isPreDeployMode) {
        throw new Error("METAMASK_NOT_INSTALLED");
      }
      return null;
    }
    return eth;
  }

  async connect(): Promise<{ address: string; chainId: bigint }> {
    // Caso 1: Modo Simulação e sem MetaMask instalada
    if (this.isPreDeployMode && !(window as any).ethereum) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return { 
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", 
        chainId: BigInt(1) 
      };
    }

    // Caso 2: Conexão real (tentamos mesmo no predeploy se a carteira existir)
    try {
      const eth = this.ethereum;
      if (!eth) throw new Error("METAMASK_NOT_INSTALLED");

      this.provider = new ethers.BrowserProvider(eth);
      const accounts = await this.provider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) throw new Error("NO_ACCOUNTS_FOUND");

      this.signer = await this.provider.getSigner();
      const network = await this.provider.getNetwork();
      
      return { address: accounts[0], chainId: network.chainId };
    } catch (error: any) {
      if (error.message === "METAMASK_NOT_INSTALLED") throw error;
      if (error.code === 4001) throw new Error("USER_REJECTED");
      throw error;
    }
  }

  async signAuthMessage(nonce: string): Promise<string> {
    // Se estiver em simulação e sem signer real, retorna assinatura mock
    if (this.isPreDeployMode && !this.signer) {
        return "0x_mock_signature_" + Math.random().toString(16).slice(2);
    }
    
    if (!this.signer) throw new Error("Wallet não conectada.");
    const address = await this.signer.getAddress();
    const message = `Garrett Wealth Management\n\nAutenticação Institucional\nEndereço: ${address}\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;
    return await this.signer.signMessage(message);
  }

  listenToEvents(onAccountChange: (addr: string) => void, onChainChange: (chainId: string) => void) {
    if (this.isPreDeployMode && !(window as any).ethereum) return;
    if (!this.isInstalled()) return;
    
    const eth = (window as any).ethereum;
    if (!eth) return;

    eth.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length > 0) onAccountChange(accounts[0]);
      else window.location.reload();
    });

    eth.on('chainChanged', (chainId: string) => {
      onChainChange(chainId);
      window.location.reload();
    });
  }

  getNetworkName(chainId: bigint): ChainNetwork {
    const id = Number(chainId);
    if (id === 1) return ChainNetwork.ETHEREUM;
    if (id === 137) return ChainNetwork.POLYGON;
    if (id === 56) return ChainNetwork.BNB_CHAIN;
    if (id === 42161) return ChainNetwork.ARBITRUM;
    return ChainNetwork.ETHEREUM;
  }

  async getBalance(address: string): Promise<string> {
    if (this.isPreDeployMode && !this.provider) return "42.690";
    
    if (!this.provider && (window as any).ethereum) {
        this.provider = new ethers.BrowserProvider((window as any).ethereum);
    }
    
    if (!this.provider) return "0.000";

    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch {
      return "0.000";
    }
  }

  async getRecentTransactions(address: string): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      "0x7c4e23194a218f7d92109847120938471029384710293847102938471029384a",
      "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f",
      "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
      "0x6b29384710293847102938471029384710293847102938471029384710293842"
    ];
  }

  async disconnect() {
    this.provider = null;
    this.signer = null;
  }
}

export const web3Service = new Web3ProviderService();

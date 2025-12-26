
export const ChainNetwork = {
  ETHEREUM: 'Ethereum',
  POLYGON: 'Polygon',
  BNB_CHAIN: 'BSC',
  ARBITRUM: 'Arbitrum'
} as const;

export type ChainNetwork = typeof ChainNetwork[keyof typeof ChainNetwork];

export type KYCStatus = 'pending' | 'approved' | 'rejected' | 'NOT_STARTED';
export type FiatCurrency = 'BRL' | 'USD' | 'PYG';
export type AssetType = 'crypto' | 'fiat' | 'lp';

export interface UserProfile {
  id: string;
  address: string;
  name: string;
  email: string;
  kycStatus: KYCStatus;
  tier: 'BASIC' | 'PRO' | 'INSTITUTIONAL';
  createdAt: number;
  fiatBalance: number;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Trade {
  hash: string;
  type: 'BUY' | 'SELL';
  amount: string;
  price: number;
  time: number;
}

export type ViewState = 'splash' | 'dashboard' | 'wallet' | 'swap' | 'pools' | 'settings' | 'support' | 'auth' | 'infrastructure' | 'database' | 'security' | 'env' | 'fiat' | 'dex';

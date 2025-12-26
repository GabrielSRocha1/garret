
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

export interface KYCRecord {
  id: string;
  userId: string;
  provider: string;
  status: 'pending' | 'approved' | 'rejected';
  externalId?: string;
  reviewedAt?: number;
  createdAt: number;
}

export interface AssetRecord {
  id: string;
  symbol: string;
  name: string;
  chain?: string;
  contractAddress?: string;
  decimals?: number;
  type: AssetType;
  createdAt: number;
}

export interface BalanceRecord {
  id: string;
  userId: string;
  assetId: string;
  amount: number;
  updatedAt: number;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  assetId: string;
  txHash?: string;
  type: 'deposit' | 'withdraw' | 'swap' | 'fiat_in' | 'fiat_out';
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: number;
}

export interface FiatTransactionRecord {
  id: string;
  userId: string;
  provider: string;
  amount: number;
  currency: string;
  type: 'on_ramp' | 'off_ramp';
  status: string;
  createdAt: number;
}

export interface AuditLogRecord {
  id: string;
  userId?: string;
  action: string;
  metadata: any;
  createdAt: number;
}

export interface PoolRecord {
  id: string;
  assetA: string;
  assetB: string;
  poolAddress?: string;
  apy: number;
  tvl: number;
  createdAt: number;
}

export interface UserLiquidityRecord {
  id: string;
  userId: string;
  poolId: string;
  lpAmount: number;
  createdAt: number;
}

export interface Wallet {
  id: string;
  userId: string;
  address: string;
  chain: ChainNetwork;
  isPrimary: boolean;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  address: string; // Primary wallet address
  name: string;
  email: string;
  phone?: string;
  country?: string;
  kycStatus: KYCStatus;
  tier: 'BASIC' | 'PRO' | 'INSTITUTIONAL';
  createdAt: number;
  wallets?: Wallet[];
}

export interface Asset {
  symbol: string;
  name: string;
  balance: number;
  priceUsd: number;
  change24h: number;
  icon: string;
}

export interface Pool {
  id: string;
  pair: string;
  tvl: number;
  apr: number;
  volume24h: number;
  myLiquidity: number;
}

export interface Transaction {
  id: string;
  method: string;
  from: string;
  to: string;
  value: string;
  currency?: string;
  status: 'pending' | 'confirmed' | 'failed';
  type: 'SWAP' | 'ON_RAMP' | 'OFF_RAMP' | 'DEPOSIT' | 'WITHDRAW';
  timestamp: number;
  hash?: string;
}

export interface Block {
  number: number;
  hash: string;
  transactions: Transaction[];
  timestamp: number;
}

export type ViewState = 'splash' | 'dashboard' | 'wallet' | 'swap' | 'pools' | 'settings' | 'support' | 'auth' | 'infrastructure' | 'database' | 'security' | 'env';

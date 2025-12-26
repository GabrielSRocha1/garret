
import { web3Service } from './web3Provider.ts';
import { backendApi } from './backendService.ts';
import { Candle, Trade } from '../types.ts';

class IndexerService {
  private candles: Map<number, Candle> = new Map();
  private trades: Trade[] = [];
  private currentPrice: number = 2452.82;
  private activeMinute: number = 0;

  constructor() {
    this.init();
  }

  private async init() {
    // 1. Bootstrapping: Carregar histórico do Supabase
    const dbTrades = await backendApi.getGlobalTradeHistory();
    this.trades = dbTrades;
    this.reconstructCandles(dbTrades);
    
    // 2. Sincronizar preço atual on-chain
    this.currentPrice = await web3Service.getPrice();
    
    // 3. Worker: Escutar eventos em tempo real
    web3Service.listenToMarketEvents(async (event) => {
      const ts = event.timestamp || Date.now() / 1000;
      const minuteBucket = Math.floor(ts / 60) * 60;

      if (event.type === 'SYNC') {
        this.currentPrice = event.price;
        this.updateCandlePrice(event.price, minuteBucket);
      } else if (event.type === 'SWAP') {
        const trade: Trade = {
          hash: event.hash,
          type: event.side,
          amount: event.amount,
          price: this.currentPrice,
          time: ts
        };
        
        // Persistência Async no Backend
        backendApi.saveOnChainSwap(trade).catch(console.error);
        
        // Atualização da UI
        this.trades.unshift(trade);
        if (this.trades.length > 50) this.trades.pop();
        
        this.addTradeToCandle(trade, minuteBucket);
      }
    });
  }

  private reconstructCandles(history: Trade[]) {
    if (history.length === 0) {
      this.generateMockHistory();
      return;
    }
    const sorted = [...history].sort((a, b) => a.time - b.time);
    sorted.forEach(t => {
      const min = Math.floor(t.time / 60) * 60;
      this.addTradeToCandle(t, min);
    });
  }

  private addTradeToCandle(trade: Trade, minute: number) {
    const price = trade.price;
    const vol = parseFloat(trade.amount);
    
    if (!this.candles.has(minute)) {
      this.candles.set(minute, {
        time: minute,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: vol
      });
    } else {
      const c = this.candles.get(minute)!;
      c.close = price;
      c.high = Math.max(c.high, price);
      c.low = Math.min(c.low, price);
      c.volume += vol;
    }
    this.activeMinute = minute;
  }

  private updateCandlePrice(price: number, minute: number) {
    if (!this.candles.has(minute)) {
      const prev = this.candles.get(this.activeMinute)?.close || price;
      this.candles.set(minute, {
        time: minute,
        open: prev,
        high: Math.max(prev, price),
        low: Math.min(prev, price),
        close: price,
        volume: 0
      });
      this.activeMinute = minute;
    } else {
      const c = this.candles.get(minute)!;
      c.close = price;
      c.high = Math.max(c.high, price);
      c.low = Math.min(c.low, price);
    }
  }

  private generateMockHistory() {
    let price = 2450.0;
    const now = Math.floor(Date.now() / 1000 / 60) * 60;
    for (let i = 100; i > 0; i--) {
      const t = now - (i * 60);
      const open = price;
      const close = price + (Math.random() - 0.5) * 5;
      this.candles.set(t, {
        time: t,
        open,
        high: Math.max(open, close) + 1,
        low: Math.min(open, close) - 1,
        close,
        volume: Math.random() * 500
      });
      price = close;
    }
  }

  public getCandles(): Candle[] {
    return Array.from(this.candles.values()).sort((a, b) => a.time - b.time);
  }

  public getRecentTrades(): Trade[] { return [...this.trades]; }

  public getMarketStats() {
    const all = this.getCandles();
    const last24h = all.slice(-1440);
    const startPrice = last24h[0]?.open || this.currentPrice;
    const change = ((this.currentPrice - startPrice) / startPrice) * 100;

    return {
      price: this.currentPrice,
      change24h: change,
      liquidity: 2450890,
      volume24h: last24h.reduce((acc, c) => acc + c.volume, 0)
    };
  }
}

export const indexer = new IndexerService();

export type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
};

export type Position = {
  id: string;
  coinId: string;
  entryPrice: number;
  margin: number;
  leverage: number;
  isLong: boolean;
  positionSize: number;
  takeProfit: number | null;
  stopLoss: number | null;
  openTime: number;
  closeTime?: number;
  closePrice?: number;
  pnl?: number;
  pnlPercentage?: number;
  currentPnl: number;
  currentPnlPercentage: number;
};

export type WalletState = {
  balance: number;
  totalPnl: number;
};
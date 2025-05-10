import { Position } from "../types";

export const calculatePositionSize = (margin: number, leverage: number): number => {
  return margin * leverage;
};

export const calculateLiquidationPrice = (
  entryPrice: number,
  leverage: number,
  isLong: boolean
): number => {
  if (isLong) {
    return entryPrice * (1 - 1 / leverage);
  } else {
    return entryPrice * (1 + 1 / leverage);
  }
};

export const calculatePnl = (
  position: Position,
  currentPrice: number
): { pnl: number; pnlPercentage: number } => {
  const { entryPrice, positionSize, margin, isLong } = position;

  let pnl = 0;
  if (isLong) {
    pnl = ((currentPrice - entryPrice) * positionSize) / entryPrice;
  } else {
    pnl = ((entryPrice - currentPrice) * positionSize) / entryPrice;
  }

  const pnlPercentage = (pnl / margin) * 100;

  return { pnl, pnlPercentage };
};

export const formatCurrency = (amount: number, precision = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(amount);
};

export const formatPercentage = (percentage: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percentage / 100);
};

export const shouldTriggerTakeProfit = (
  position: Position,
  currentPrice: number
): boolean => {
  if (!position.takeProfit) return false;
  
  if (position.isLong) {
    return currentPrice >= position.takeProfit;
  } else {
    return currentPrice <= position.takeProfit;
  }
};

export const shouldTriggerStopLoss = (
  position: Position,
  currentPrice: number
): boolean => {
  if (!position.stopLoss) return false;
  
  if (position.isLong) {
    return currentPrice <= position.stopLoss;
  } else {
    return currentPrice >= position.stopLoss;
  }
};

export const isLiquidated = (
  position: Position,
  currentPrice: number
): boolean => {
  const liquidationPrice = calculateLiquidationPrice(
    position.entryPrice,
    position.leverage,
    position.isLong
  );
  
  if (position.isLong) {
    return currentPrice <= liquidationPrice;
  } else {
    return currentPrice >= liquidationPrice;
  }
};
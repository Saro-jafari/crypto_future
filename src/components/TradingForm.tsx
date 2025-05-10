import React, { useState, useEffect } from 'react';
import useTradeStore from '../store/useTradeStore';
import { calculateLiquidationPrice, calculatePositionSize } from '../utils/calculations';

const TradingForm: React.FC = () => {
  const { selectedCoin, wallet, openPosition } = useTradeStore();
  
  const [isLong, setIsLong] = useState(true);
  const [margin, setMargin] = useState(100);
  const [leverage, setLeverage] = useState(10);
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  
  const [positionSize, setPositionSize] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  
  useEffect(() => {
    if (!selectedCoin) return;
    
    const size = calculatePositionSize(margin, leverage);
    setPositionSize(size);
    
    const liqPrice = calculateLiquidationPrice(
      selectedCoin.current_price,
      leverage,
      isLong
    );
    setLiquidationPrice(liqPrice);
  }, [selectedCoin, margin, leverage, isLong]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCoin) {
      alert('Please select a coin first');
      return;
    }
    
    if (margin <= 0) {
      alert('Margin must be greater than 0');
      return;
    }
    
    if (margin > wallet.balance) {
      alert('Not enough balance');
      return;
    }
    
    const tp = takeProfit ? parseFloat(takeProfit) : null;
    const sl = stopLoss ? parseFloat(stopLoss) : null;
    
    openPosition({
      coinId: selectedCoin.id,
      entryPrice: selectedCoin.current_price,
      margin,
      leverage,
      isLong,
      takeProfit: tp,
      stopLoss: sl,
      positionSize,
    });
    
    // Reset form after submission
    setMargin(100);
    setLeverage(10);
    setTakeProfit('');
    setStopLoss('');
  };
  
  if (!selectedCoin) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow-lg">
        <div className="text-center text-gray-600 dark:text-gray-300 py-8">
          Please select a cryptocurrency to trade
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Open {selectedCoin.name} Position
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isLong
                ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setIsLong(true)}
          >
            Long
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !isLong
                ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setIsLong(false)}
          >
            Short
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Margin (USDT)
            </label>
            <input
              type="number"
              value={margin}
              onChange={(e) => setMargin(Math.max(0, parseFloat(e.target.value) || 0))}
              min="1"
              max={wallet.balance}
              step="10"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-transparent transition-colors"
              required
            />
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Available: ${wallet.balance.toFixed(2)} USDT
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Leverage (x)
            </label>
            <div className="relative">
              <input
                type="number"
                value={leverage}
                onChange={(e) => setLeverage(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                min="1"
                max="100"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-transparent transition-colors"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 dark:text-gray-400">x</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Take Profit (optional)
            </label>
            <input
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder={`e.g. ${isLong ? 
                (selectedCoin.current_price * 1.05).toFixed(2) : 
                (selectedCoin.current_price * 0.95).toFixed(2)}`}
              step="0.01"
              min={isLong ? selectedCoin.current_price : 0}
              max={isLong ? undefined : selectedCoin.current_price}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stop Loss (optional)
            </label>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder={`e.g. ${isLong ? 
                (selectedCoin.current_price * 0.95).toFixed(2) : 
                (selectedCoin.current_price * 1.05).toFixed(2)}`}
              step="0.01"
              min={isLong ? 0 : selectedCoin.current_price}
              max={isLong ? selectedCoin.current_price : undefined}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Entry Price:</span>
            <span className="text-gray-900 dark:text-white font-mono">${selectedCoin.current_price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Position Size:</span>
            <span className="text-gray-900 dark:text-white font-mono">${positionSize.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Liquidation Price:</span>
            <span className={`font-mono ${isLong ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              ${liquidationPrice.toFixed(2)}
            </span>
          </div>
        </div>
        
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
            isLong 
              ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800' 
              : 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
          }`}
        >
          Open {isLong ? 'Long' : 'Short'} Position
        </button>
      </form>
    </div>
  );
};

export default TradingForm;
import React from 'react';
import useTradeStore from '../store/useTradeStore';
import { calculatePnl } from '../utils/calculations';
import { formatCurrency, formatPercentage } from '../utils/calculations';

const PositionsList: React.FC = () => {
  const { activePositions, coins, closePosition } = useTradeStore();
  
  if (activePositions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Active Positions</h2>
        <div className="text-center text-gray-600 dark:text-gray-300 py-8">
          No active positions. Open a position to start trading.
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow-lg overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Active Positions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Coin</th>
              <th className="py-2 px-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Side</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Leverage</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entry</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PnL</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PnL %</th>
              <th className="py-2 px-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {activePositions.map((position) => {
              const coin = coins.find((c) => c.id === position.coinId);
              if (!coin) return null;
              
              const { pnl, pnlPercentage } = calculatePnl(position, coin.current_price);
              const isProfitable = pnl > 0;
              
              return (
                <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={coin.image} 
                        alt={coin.name} 
                        className="w-6 h-6 rounded-full mr-2" 
                      />
                      <span className="font-medium text-gray-900 dark:text-white">{coin.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      position.isLong 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                    }`}>
                      {position.isLong ? 'LONG' : 'SHORT'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono text-gray-900 dark:text-white">
                    {formatCurrency(position.positionSize)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono text-gray-900 dark:text-white">
                    {position.leverage}x
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono text-gray-900 dark:text-white">
                    {formatCurrency(position.entryPrice)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono">
                    <span className={isProfitable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {isProfitable ? '+' : ''}{formatCurrency(pnl)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono">
                    <span className={isProfitable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {isProfitable ? '+' : ''}{formatPercentage(pnlPercentage)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => closePosition(position.id, coin.current_price)}
                      className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                      Close
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionsList;
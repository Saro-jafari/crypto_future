import React from 'react';
import useTradeStore from '../store/useTradeStore';
import { formatCurrency, formatPercentage } from '../utils/calculations';

const TransactionHistory: React.FC = () => {
  const { closedPositions, coins } = useTradeStore();
  
  if (closedPositions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Transaction History</h2>
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
          No transaction history yet. Closed positions will appear here.
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden">
      <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Coin</th>
              <th className="py-2 px-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Side</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Leverage</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entry</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exit</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PnL</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PnL %</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {closedPositions.map((position) => {
              const coin = coins.find((c) => c.id === position.coinId);
              const isProfitable = position.pnl && position.pnl > 0;
              
              return (
                <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {coin && (
                        <img 
                          src={coin.image} 
                          alt={coin.name} 
                          className="w-6 h-6 rounded-full mr-2" 
                        />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">{coin ? coin.name : position.coinId}</span>
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
                    {position.leverage}x
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono text-gray-900 dark:text-white">
                    {formatCurrency(position.entryPrice)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono text-gray-900 dark:text-white">
                    {position.closePrice ? formatCurrency(position.closePrice) : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono">
                    <span className={isProfitable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {isProfitable ? '+' : ''}
                      {position.pnl ? formatCurrency(position.pnl) : 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono">
                    <span className={isProfitable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {isProfitable ? '+' : ''}
                      {position.pnlPercentage ? formatPercentage(position.pnlPercentage) : 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {position.closeTime ? new Date(position.closeTime).toLocaleString() : 'N/A'}
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

export default TransactionHistory;
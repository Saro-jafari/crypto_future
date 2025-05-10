import React from 'react';
import useTradeStore from '../store/useTradeStore';
import { formatCurrency } from '../utils/calculations';

const Wallet: React.FC = () => {
  const { wallet, resetWallet } = useTradeStore();
  
  const handleResetWallet = () => {
    if (confirm('Are you sure you want to reset your wallet? This will remove all positions and reset your balance.')) {
      resetWallet();
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Demo Wallet</h2>
        <button
          onClick={handleResetWallet}
          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded text-sm font-medium transition-colors"
        >
          Reset Wallet
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Available Balance</div>
          <div className="text-gray-900 dark:text-white text-2xl font-bold font-mono">
            {formatCurrency(wallet.balance)}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total PnL</div>
          <div className={`text-2xl font-bold font-mono ${
            wallet.totalPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {wallet.totalPnl >= 0 ? '+' : ''}
            {formatCurrency(wallet.totalPnl)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
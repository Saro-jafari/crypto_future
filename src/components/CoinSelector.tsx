import React, { useState } from 'react';
import { Search } from 'lucide-react';
import useTradeStore from '../store/useTradeStore';
import { Coin } from '../types';

const CoinSelector: React.FC = () => {
	const { coins, selectedCoin, setSelectedCoin } = useTradeStore();
	const [searchQuery, setSearchQuery] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	console.log(coins, 'coins');
	// If coins is loading, you could show a loader or message
	if (!Array.isArray(coins)) {
		return <div>Loading coins...</div>; // or handle this case as needed
	}

	const filteredCoins = coins.filter(
		coin => coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleSelectCoin = (coin: Coin) => {
		setSelectedCoin(coin);
		setIsSearching(false);
		setSearchQuery('');
	};

	return (
		<div className="p-4 mb-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
			<div className="relative mb-4">
				<Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
				<input
					type="text"
					value={searchQuery}
					onChange={e => {
						setSearchQuery(e.target.value);
						setIsSearching(true);
					}}
					placeholder="Search coins..."
					className="w-full py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 transition-colors border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
				/>
			</div>

			{(isSearching || searchQuery) && (
				<div className="overflow-x-auto">
					<table className="min-w-full overflow-hidden bg-white rounded-lg dark:bg-gray-900">
						<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
							{filteredCoins?.map(coin => (
								<tr
									key={coin.id}
									onClick={() => handleSelectCoin(coin)}
									className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
										selectedCoin?.id === coin.id ? 'bg-gray-50 dark:bg-gray-700' : ''
									}`}>
									<td className="px-4 py-3 whitespace-nowrap">
										<div className="flex items-center">
											<img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2 rounded-full" />
											<span className="font-medium text-gray-900 dark:text-white">{coin.name}</span>
											<span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</span>
										</div>
									</td>
									<td className="px-4 py-3 text-right whitespace-nowrap">
										<span className="font-mono text-gray-900 dark:text-white">
											${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
										</span>
									</td>
									<td className="px-4 py-3 text-right whitespace-nowrap">
										<span
											className={`font-mono ${
												coin.price_change_percentage_24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
											}`}>
											{coin.price_change_percentage_24h >= 0 ? '+' : ''}
											{coin.price_change_percentage_24h.toFixed(2)}%
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{!isSearching && !searchQuery && selectedCoin && (
				<div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<img src={selectedCoin.image} alt={selectedCoin.name} className="w-8 h-8 mr-3 rounded-full" />
							<div>
								<h3 className="font-medium text-gray-900 dark:text-white">{selectedCoin.name}</h3>
								<span className="text-sm text-gray-500 dark:text-gray-400">{selectedCoin.symbol.toUpperCase()}</span>
							</div>
						</div>
						<div className="text-right">
							<div className="font-mono text-gray-900 dark:text-white">
								${selectedCoin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
							<span
								className={`font-mono ${
									selectedCoin.price_change_percentage_24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
								}`}>
								{selectedCoin.price_change_percentage_24h >= 0 ? '+' : ''}
								{selectedCoin.price_change_percentage_24h.toFixed(2)}%
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CoinSelector;

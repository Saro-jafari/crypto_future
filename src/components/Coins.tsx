import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, SortAsc, SortDesc } from 'lucide-react';
import useTradeStore from '../store/useTradeStore';
import { formatCurrency, formatPercentage } from '../utils/calculations';

type SortKey = 'name' | 'price' | 'change';
type SortOrder = 'asc' | 'desc';

const Coins: React.FC = () => {
	const { t } = useTranslation();
	const { coins, setSelectedCoin } = useTradeStore();
	const [search, setSearch] = useState('');
	const [sortKey, setSortKey] = useState<SortKey>('price');
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

	const filteredAndSortedCoins = useMemo(() => {
		const coinsArray = Array.isArray(coins) ? coins : []; // Ensure coins is an array

		return coinsArray
			.filter(coin => coin.name.toLowerCase().includes(search.toLowerCase()) || coin.symbol.toLowerCase().includes(search.toLowerCase()))
			.sort((a, b) => {
				let comparison = 0;
				switch (sortKey) {
					case 'name':
						comparison = a.name.localeCompare(b.name);
						break;
					case 'price':
						comparison = a.current_price - b.current_price;
						break;
					case 'change':
						comparison = a.price_change_percentage_24h - b.price_change_percentage_24h;
						break;
				}
				return sortOrder === 'asc' ? comparison : -comparison;
			});
	}, [coins, search, sortKey, sortOrder]);

	const toggleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortOrder(order => (order === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortKey(key);
			setSortOrder('desc');
		}
	};

	const handleCoinSelect = (coin: any) => {
		setSelectedCoin(coin);
		window.location.hash = '#trade';
	};

	const SortIcon = ({ active }: { active: boolean }) => {
		const Icon = sortOrder === 'asc' ? SortAsc : SortDesc;
		return <Icon className={`w-4 h-4 ${active ? 'text-primary-500' : 'text-gray-400'}`} />;
	};

	return (
		<div className="space-y-4">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
				<input
					type="text"
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder={t('coins.search')}
					className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
				/>
			</div>

			<div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead>
							<tr className="bg-gray-50 dark:bg-gray-900">
								<th className="px-4 py-3 text-left cursor-pointer" onClick={() => toggleSort('name')}>
									<div className="flex items-center space-x-1">
										<span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('coins.asset')}</span>
										<SortIcon active={sortKey === 'name'} />
									</div>
								</th>
								<th className="px-4 py-3 text-right cursor-pointer" onClick={() => toggleSort('price')}>
									<div className="flex items-center justify-end space-x-1">
										<span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('coins.price')}</span>
										<SortIcon active={sortKey === 'price'} />
									</div>
								</th>
								<th className="px-4 py-3 text-right cursor-pointer" onClick={() => toggleSort('change')}>
									<div className="flex items-center justify-end space-x-1">
										<span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('coins.24hChange')}</span>
										<SortIcon active={sortKey === 'change'} />
									</div>
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
							{filteredAndSortedCoins.map(coin => (
								<tr key={coin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => handleCoinSelect(coin)}>
									<td className="px-4 py-4 whitespace-nowrap">
										<div className="flex items-center space-x-3 rtl:space-x-reverse">
											<img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
											<div>
												<div className="font-medium dark:text-white">{coin.name}</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</div>
											</div>
										</div>
									</td>
									<td className="px-4 py-4 text-right whitespace-nowrap">
										<div className="font-medium dark:text-white">{formatCurrency(coin.current_price)}</div>
									</td>
									<td className="px-4 py-4 text-right whitespace-nowrap">
										<span
											className={`${
												coin.price_change_percentage_24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
											}`}>
											{formatPercentage(coin.price_change_percentage_24h / 100)}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Coins;

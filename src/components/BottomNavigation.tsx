import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, LineChart, History, Settings, Coins, CandlestickChart } from 'lucide-react';

interface Props {
	activeTab: string;
	onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
	const { t } = useTranslation();

	return (
		<nav className="max-w-lg  mx-auto fixed bottom-0 left-0 right-0 w-full z-50 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 pb-safe block">
			<div className="grid h-16 grid-cols-6">
				<button
					onClick={() => onTabChange('trade')}
					className={`flex flex-col items-center justify-center space-y-1 ${
						activeTab === 'trade' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
					}`}>
					<LineChart className="w-6 h-6" />
					<span className="text-xs">{t('common.trade')}</span>
				</button>

				<button
					onClick={() => onTabChange('chart')}
					className={`flex flex-col items-center justify-center space-y-1 ${
						activeTab === 'chart' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
					}`}>
					<CandlestickChart className="w-6 h-6" />
					<span className="text-xs">{t('common.chart')}</span>
				</button>

				<button
					onClick={() => onTabChange('coins')}
					className={`flex flex-col items-center justify-center space-y-1 ${
						activeTab === 'coins' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
					}`}>
					<Coins className="w-6 h-6" />
					<span className="text-xs">{t('common.coins')}</span>
				</button>

				<button
					onClick={() => onTabChange('wallet')}
					className={`flex flex-col items-center justify-center space-y-1 ${
						activeTab === 'wallet' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
					}`}>
					<Wallet className="w-6 h-6" />
					<span className="text-xs">{t('common.wallet')}</span>
				</button>

				<button
					onClick={() => onTabChange('history')}
					className={`flex flex-col items-center justify-center space-y-1 ${
						activeTab === 'history' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
					}`}>
					<History className="w-6 h-6" />
					<span className="text-xs">{t('common.history')}</span>
				</button>

				<button
					onClick={() => onTabChange('settings')}
					className={`flex flex-col items-center justify-center space-y-1 ${
						activeTab === 'settings' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
					}`}>
					<Settings className="w-6 h-6" />
					<span className="text-xs">{t('common.settings')}</span>
				</button>
			</div>
		</nav>
	);
};

export default BottomNavigation;

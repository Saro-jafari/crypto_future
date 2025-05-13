import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import CoinSelector from './components/CoinSelector';
import TradingForm from './components/TradingForm';
import PositionsList from './components/PositionsList';
import TransactionHistory from './components/TransactionHistory';
import Wallet from './components/Wallet';
import Settings from './components/Settings';
import Coins from './components/Coins';
import Chart from './components/Chart';
import BottomNavigation from './components/BottomNavigation';
import useTradeStore from './store/useTradeStore';
import { fetchTopCoins } from './api/crypto';
import { useTheme } from './hooks/useTheme';

type Tab = 'trade' | 'chart' | 'coins' | 'wallet' | 'history' | 'settings';

function App() {
	const { t } = useTranslation();
	const { setCoins, selectedCoin } = useTradeStore();
	const [activeTab, setActiveTab] = useState<Tab>('coins');
	const { theme } = useTheme();
	console.log(theme, 'theme');
	const {
		data: coins,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['coins'],
		queryFn: () => fetchTopCoins(),
		refetchInterval: 60000,
	});

	useEffect(() => {
		if (coins) {
			setCoins(coins);
		}
	}, [coins, setCoins]);

	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash.slice(1);
			if (hash && ['trade', 'chart', 'coins', 'wallet', 'history', 'settings'].includes(hash)) {
				setActiveTab(hash as Tab);
			}
		};

		window.addEventListener('hashchange', handleHashChange);
		handleHashChange();

		return () => window.removeEventListener('hashchange', handleHashChange);
	}, []);

	const handleTabChange = (tab: Tab) => {
		setActiveTab(tab);
		window.history.replaceState(null, '', `${tab}`);
	};

	const renderTabContent = () => {
		switch (activeTab) {
			case 'trade':
				return (
					<div className="space-y-4">
						{isLoading ? (
							<div className="p-6 text-center bg-white rounded-lg dark:bg-gray-800">
								<p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
							</div>
						) : error ? (
							<div className="p-6 text-center bg-white rounded-lg dark:bg-gray-800">
								<p className="text-red-600 dark:text-red-400">{t('common.error')}</p>
							</div>
						) : (
							<>
								<CoinSelector />
								{selectedCoin && <TradingForm />}
								<PositionsList />
							</>
						)}
					</div>
				);
			case 'chart':
				return (
					<div className="space-y-4">
						<CoinSelector />
						<Chart />
					</div>
				);
			case 'coins':
				return <Coins />;
			case 'wallet':
				return <Wallet />;
			case 'history':
				return <TransactionHistory />;
			case 'settings':
				return <Settings />;
			default:
				return null;
		}
	};

	return (
		<div className="mx-auto w-full max-w-[480px] min-h-screen text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-white">
			<header className="bg-white shadow-sm dark:bg-gray-800 ">
				<div className="px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<a href="/">
								{' '}
								{theme === 'light' ? (
									<svg width="110" height="40" viewBox="0 0 145.0562915565378 36.00000000000001" className="looka-1j8o68f ">
										<defs id="SvgjsDefs2994"></defs>
										<g
											id="SvgjsG2995"
											featurekey="nameLeftFeature-0"
											transform="matrix(1.1889383643792597,0,0,1.1889383643792597,-1.2540922266591146,-12.278166089825902)"
											fill="#000000">
											<path d="M27.09 26.719 c1.1328 4.1016 -2.2656 8.9453 -5.4102 11.074 c-6.1719 4.043 -14.316 3.3984 -20.625 0.15625 l1.8359 -8.125 l3.0273 0 c0.39063 4.1992 9.7852 5.9375 10.742 1.7969 c0.46875 -2.0508 -6.8945 -2.6172 -9.3555 -4.5508 c-0.13672 -0.11719 -0.29297 -0.23438 -0.41016 -0.35156 l-1.7969 0 c-1.9531 -1.8359 -2.1289 -4.2773 -1.5625 -6.8164 c2.3828 -10.41 16.523 -11.445 24.688 -7.3242 l-1.8164 7.9102 l-3.0469 0 c0.19531 -2.9688 -8.7891 -5 -9.6289 -1.4258 c-0.56641 2.7734 8.5352 1.9531 11.055 6.3477 c0.21484 0.39063 0.39063 0.85938 0.50781 1.3086 l1.7969 0 z"></path>
										</g>
										<g id="SvgjsG2996" featurekey="inlineSymbolFeature-0" transform="matrix(0.45,0,0,0.45,32.5,-4.5)" fill="#000000">
											<path
												xmlns="http://www.w3.org/2000/svg"
												d="M50,10L10,90h80L50,10z M50,24.909L72.546,70H42.36l3.333-6.667h16.064L50,39.814L31.575,76.667h44.304l3.333,6.666H20.788  L50,24.909z"></path>
										</g>
										<g
											id="SvgjsG2997"
											featurekey="nameRightFeature-0"
											transform="matrix(1.1769898420037,0,0,1.1769898420037,76.34514763064792,-12.206561992649727)"
											fill="#000000">
											<path d="M4.4727 26.719 l-1.7773 0 l3.6328 -15.957 c3.3984 0 9.5313 -0.33203 14.375 0.3125 c4.2773 0.625 8.418 2.207 7.6953 7.3438 c-0.41016 3.1055 -2.793 6.2891 -5.3711 8.3008 l1.7578 0 c-0.46875 0.35156 -0.9375 0.72266 -1.4453 0.97656 l6.6797 12.383 l-11.719 0 l-4.8828 -9.5508 l-2.168 9.5508 l-9.8438 0 z M14.551 17.988 l-1.1914 5.0391 c4.707 0 7.3438 -5.0391 1.1914 -5.0391 z M56.816218750000004 25.683999999999997 c-0.15625 0.625 -0.33203 1.25 -0.56641 1.8945 l2.1289 0 c-2.4805 7.7539 -8.7891 13.379 -17.441 13.379 c-8.9258 0 -12.402 -5.625 -11.27 -13.379 l-2.0703 0 c0.078125 -0.64453 0.17578 -1.2695 0.3125 -1.8945 c2.0703 -8.9258 8.5352 -15.313 17.93 -15.313 c9.1992 0 12.988 6.4453 10.977 15.313 z M48.24221875 27.578 l-2.1094 0 c0.19531 -0.64453 0.39063 -1.2695 0.52734 -1.9336 c2.4805 -10.723 -6.1719 -10.41 -8.5938 0.039063 c-0.13672 0.68359 -0.23438 1.3086 -0.33203 1.8945 l2.1094 0 c-1.0156 8.1641 5.6445 7.9883 8.3984 0 z"></path>
										</g>
									</svg>
								) : (
									<svg width="110" height="40" viewBox="0 0 145.0562915565378 36.00000000000001" className="looka-1j8o68f">
										<defs id="SvgjsDefs3280"></defs>
										<g
											id="SvgjsG3281"
											featurekey="nameLeftFeature-0"
											transform="matrix(1.1889383643792597,0,0,1.1889383643792597,-1.2540922266591146,-12.278166089825902)"
											fill="#ffffff">
											<path d="M27.09 26.719 c1.1328 4.1016 -2.2656 8.9453 -5.4102 11.074 c-6.1719 4.043 -14.316 3.3984 -20.625 0.15625 l1.8359 -8.125 l3.0273 0 c0.39063 4.1992 9.7852 5.9375 10.742 1.7969 c0.46875 -2.0508 -6.8945 -2.6172 -9.3555 -4.5508 c-0.13672 -0.11719 -0.29297 -0.23438 -0.41016 -0.35156 l-1.7969 0 c-1.9531 -1.8359 -2.1289 -4.2773 -1.5625 -6.8164 c2.3828 -10.41 16.523 -11.445 24.688 -7.3242 l-1.8164 7.9102 l-3.0469 0 c0.19531 -2.9688 -8.7891 -5 -9.6289 -1.4258 c-0.56641 2.7734 8.5352 1.9531 11.055 6.3477 c0.21484 0.39063 0.39063 0.85938 0.50781 1.3086 l1.7969 0 z"></path>
										</g>
										<g id="SvgjsG3282" featurekey="inlineSymbolFeature-0" transform="matrix(0.45,0,0,0.45,32.5,-4.5)" fill="#ffffff">
											<path
												xmlns="http://www.w3.org/2000/svg"
												d="M50,10L10,90h80L50,10z M50,24.909L72.546,70H42.36l3.333-6.667h16.064L50,39.814L31.575,76.667h44.304l3.333,6.666H20.788  L50,24.909z"></path>
										</g>
										<g
											id="SvgjsG3283"
											featurekey="nameRightFeature-0"
											transform="matrix(1.1769898420037,0,0,1.1769898420037,76.34514763064792,-12.206561992649727)"
											fill="#ffffff">
											<path d="M4.4727 26.719 l-1.7773 0 l3.6328 -15.957 c3.3984 0 9.5313 -0.33203 14.375 0.3125 c4.2773 0.625 8.418 2.207 7.6953 7.3438 c-0.41016 3.1055 -2.793 6.2891 -5.3711 8.3008 l1.7578 0 c-0.46875 0.35156 -0.9375 0.72266 -1.4453 0.97656 l6.6797 12.383 l-11.719 0 l-4.8828 -9.5508 l-2.168 9.5508 l-9.8438 0 z M14.551 17.988 l-1.1914 5.0391 c4.707 0 7.3438 -5.0391 1.1914 -5.0391 z M56.816218750000004 25.683999999999997 c-0.15625 0.625 -0.33203 1.25 -0.56641 1.8945 l2.1289 0 c-2.4805 7.7539 -8.7891 13.379 -17.441 13.379 c-8.9258 0 -12.402 -5.625 -11.27 -13.379 l-2.0703 0 c0.078125 -0.64453 0.17578 -1.2695 0.3125 -1.8945 c2.0703 -8.9258 8.5352 -15.313 17.93 -15.313 c9.1992 0 12.988 6.4453 10.977 15.313 z M48.24221875 27.578 l-2.1094 0 c0.19531 -0.64453 0.39063 -1.2695 0.52734 -1.9336 c2.4805 -10.723 -6.1719 -10.41 -8.5938 0.039063 c-0.13672 0.68359 -0.23438 1.3086 -0.33203 1.8945 l2.1094 0 c-1.0156 8.1641 5.6445 7.9883 8.3984 0 z"></path>
										</g>
									</svg>
								)}
							</a>
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400">Crypto</div>
					</div>
				</div>
			</header>

			<main className="px-4 py-6 pb-24">{renderTabContent()}</main>

			<BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
		</div>
	);
}

export default App;

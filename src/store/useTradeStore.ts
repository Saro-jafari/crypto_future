import { create } from 'zustand';
import { Position, WalletState, Coin } from '../types';
import { calculatePositionSize, calculatePnl, shouldTriggerTakeProfit, shouldTriggerStopLoss, isLiquidated } from '../utils/calculations';
import { persist } from 'zustand/middleware';

interface TradeStore {
	// States
	wallet: WalletState;
	coins: Coin[];
	selectedCoin: Coin | null;
	activePositions: Position[];
	closedPositions: Position[];
	isLoading: boolean;
	lastPriceUpdate: number;

	// Actions
	setCoins: (coins: Coin[]) => void;
	setSelectedCoin: (coin: Coin | null) => void;
	updateCoinPrice: (coinId: string, price: number) => void;
	openPosition: (position: Omit<Position, 'id' | 'openTime' | 'positionSize'>) => void;
	closePosition: (positionId: string, currentPrice: number) => void;
	updatePositionsPnl: () => void;
	resetWallet: () => void;
}

const DEFAULT_BALANCE = 10000; // $10,000 USDT
const UPDATE_INTERVAL = 1000; // 1 second

const useTradeStore = create<TradeStore>()(
	persist(
		(set, get) => ({
			// Initial state
			wallet: {
				balance: DEFAULT_BALANCE,
				totalPnl: 0,
			},
			coins: [],
			selectedCoin: null,
			activePositions: [],
			closedPositions: [],
			isLoading: false,
			lastPriceUpdate: Date.now(),

			// Actions
			setCoins: coins => {
				set(state => {
					const now = Date.now();
					// Only update if enough time has passed
					if (now - state.lastPriceUpdate >= UPDATE_INTERVAL) {
						return { 
							coins,
							lastPriceUpdate: now
						};
					}
					return { coins };
				});
				// Update PnL after price update
				get().updatePositionsPnl();
			},

			setSelectedCoin: coin => set({ selectedCoin: coin }),

			updateCoinPrice: (coinId, price) => {
				set(state => {
					const now = Date.now();
					// Only update if enough time has passed
					if (now - state.lastPriceUpdate < UPDATE_INTERVAL) {
						return state;
					}

					const updatedCoins = state.coins.map(coin => {
						if (coin.id === coinId) {
							return { ...coin, current_price: price };
						}
						return coin;
					});

					let updatedSelectedCoin = state.selectedCoin;
					if (state.selectedCoin?.id === coinId) {
						updatedSelectedCoin = {
							...state.selectedCoin,
							current_price: price,
						};
					}

					return {
						coins: updatedCoins,
						selectedCoin: updatedSelectedCoin,
						lastPriceUpdate: now,
					};
				});

				// Update PnL after price update
				get().updatePositionsPnl();
			},

			openPosition: positionData => {
				set(state => {
					// Calculate position size
					const positionSize = calculatePositionSize(positionData.margin, positionData.leverage);

					// Check if user has enough balance
					if (state.wallet.balance < positionData.margin) {
						alert('Not enough balance to open position');
						return state;
					}

					const newPosition: Position = {
						id: `pos_${Date.now()}`,
						openTime: Date.now(),
						positionSize,
						currentPnl: 0,
						currentPnlPercentage: 0,
						...positionData,
					};

					// Update wallet balance
					const updatedWallet = {
						...state.wallet,
						balance: state.wallet.balance - positionData.margin,
					};

					return {
						activePositions: [...state.activePositions, newPosition],
						wallet: updatedWallet,
					};
				});
			},

			closePosition: (positionId, currentPrice) => {
				set(state => {
					const position = state.activePositions.find(p => p.id === positionId);
					if (!position) return state;

					const { pnl, pnlPercentage } = calculatePnl(position, currentPrice);

					// Create closed position record
					const closedPosition: Position = {
						...position,
						closeTime: Date.now(),
						closePrice: currentPrice,
						pnl,
						pnlPercentage,
					};

					// Update wallet
					const updatedWallet = {
						balance: state.wallet.balance + position.margin + pnl,
						totalPnl: state.wallet.totalPnl + pnl,
					};

					return {
						activePositions: state.activePositions.filter(p => p.id !== positionId),
						closedPositions: [closedPosition, ...state.closedPositions],
						wallet: updatedWallet,
					};
				});
			},

			updatePositionsPnl: () => {
				set(state => {
					const { activePositions, coins } = state;
					let totalUnrealizedPnl = 0;

					// Update PnL for each position
					const updatedPositions = activePositions.map(position => {
						const coin = coins.find(c => c.id === position.coinId);
						if (!coin) return position;

						const currentPrice = coin.current_price;
						const { pnl, pnlPercentage } = calculatePnl(position, currentPrice);

						// Check for TP/SL or liquidation
						if (
							shouldTriggerTakeProfit(position, currentPrice) ||
							shouldTriggerStopLoss(position, currentPrice) ||
							isLiquidated(position, currentPrice)
						) {
							// Close the position
							get().closePosition(position.id, currentPrice);
							return position;
						}

						totalUnrealizedPnl += pnl;

						return {
							...position,
							currentPnl: pnl,
							currentPnlPercentage: pnlPercentage,
						};
					});

					// Update wallet with unrealized PnL
					const updatedWallet = {
						...state.wallet,
						totalPnl: state.wallet.totalPnl + totalUnrealizedPnl,
					};

					return {
						activePositions: updatedPositions,
						wallet: updatedWallet,
					};
				});
			},

			resetWallet: () =>
				set({
					wallet: {
						balance: DEFAULT_BALANCE,
						totalPnl: 0,
					},
					activePositions: [],
					closedPositions: [],
				}),
		}),
		{
			name: 'crypto-futures-storage',
		},
	),
);

export default useTradeStore;
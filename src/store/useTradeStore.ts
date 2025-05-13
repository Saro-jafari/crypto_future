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

			// Actions
			setCoins: coins => set({ coins }),

			setSelectedCoin: coin => set({ selectedCoin: coin }),

			updateCoinPrice: (coinId, price) => {
				set(state => {
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
					};
				});

				// Check for TP/SL triggers and liquidations after price update
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

					const { pnl } = calculatePnl(position, currentPrice);

					// Create closed position record
					const closedPosition: Position = {
						...position,
						closeTime: Date.now(),
						closePrice: currentPrice,
						pnl,
						pnlPercentage: (pnl / position.margin) * 100,
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

					// Check each position for TP/SL triggers or liquidation
					activePositions.forEach(position => {
						const coin = coins.find(c => c.id === position.coinId);
						if (!coin) return;

						const currentPrice = coin.current_price;

						// Check for TP/SL or liquidation
						if (
							shouldTriggerTakeProfit(position, currentPrice) ||
							shouldTriggerStopLoss(position, currentPrice) ||
							isLiquidated(position, currentPrice)
						) {
							// Automatically close the position
							get().closePosition(position.id, currentPrice);
						}
					});

					return {}; // No state changes here, they happen in closePosition
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

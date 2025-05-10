import { Coin } from "../types";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

// Helper function to create proxied URLs with fallback proxies
const createProxiedUrl = (endpoint: string): string => {
  // List of CORS proxies in order of preference
  const CORS_PROXIES = [
    "https://api.allorigins.win/raw?url=",
    "https://api.codetabs.com/v1/proxy?quest="
  ];
  
  const encodedUrl = encodeURIComponent(`${COINGECKO_API_URL}${endpoint}`);
  return `${CORS_PROXIES[0]}${encodedUrl}`;
};

export const fetchTopCoins = async (limit = 10): Promise<Coin[]> => {
  const response = await fetch(
    createProxiedUrl(`/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`)
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch coins: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchCoinPrice = async (coinId: string): Promise<number> => {
  const response = await fetch(
    createProxiedUrl(`/simple/price?ids=${coinId}&vs_currencies=usd`)
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch price: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!data[coinId] || typeof data[coinId].usd !== 'number') {
    throw new Error('Invalid price data structure');
  }
  
  return data[coinId].usd;
};
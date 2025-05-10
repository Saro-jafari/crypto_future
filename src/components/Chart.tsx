import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, LineStyle, IChartApi, ISeriesApi } from 'lightweight-charts';
import useTradeStore from '../store/useTradeStore';
import { useTheme } from '../hooks/useTheme';

interface ChartData {
  time: string;
  value: number;
}

const generateMockData = (currentPrice: number, days = 30): ChartData[] => {
  const data = [];
  const now = new Date();
  let price = currentPrice;
  
  // Calculate volatility based on price magnitude
  const volatilityPercentage = Math.min(Math.max(0.5, Math.log10(currentPrice)), 5);
  const volatility = currentPrice * (volatilityPercentage / 100);
  
  for (let i = days; i > 0; i--) {
    const time = new Date(now);
    time.setDate(time.getDate() - i);
    
    // Generate more realistic price movements with trend bias
    const trend = Math.sin(i / 5) * volatility * 0.3; // Add cyclic trend
    const change = (Math.random() - 0.5) * volatility + trend;
    price = Math.max(price + change, price * 0.1);
    
    data.push({
      time: time.toISOString().split('T')[0],
      value: Number(price.toFixed(2)),
    });
  }
  
  // Add current price as last point
  data.push({
    time: now.toISOString().split('T')[0],
    value: currentPrice,
  });
  
  return data;
};

const Chart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [series, setSeries] = useState<ISeriesApi<"Line"> | null>(null);
  const { selectedCoin } = useTradeStore();
  const { theme } = useTheme();
  
  // Create chart instance
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const chartInstance = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: theme === 'dark' ? '#9CA3AF' : '#4B5563',
      },
      grid: {
        vertLines: { 
          color: theme === 'dark' ? '#374151' : '#E5E7EB',
          style: LineStyle.Dotted 
        },
        horzLines: { 
          color: theme === 'dark' ? '#374151' : '#E5E7EB',
          style: LineStyle.Dotted 
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      rightPriceScale: {
        borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: {
          color: theme === 'dark' ? '#6B7280' : '#9CA3AF',
          width: 1,
          style: LineStyle.Dashed,
        },
        horzLine: {
          color: theme === 'dark' ? '#6B7280' : '#9CA3AF',
          width: 1,
          style: LineStyle.Dashed,
        },
      },
    });
    
    const lineSeriesInstance = chartInstance.addLineSeries({
      color: '#60A5FA',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: '#60A5FA',
      crosshairMarkerBackgroundColor: '#60A5FA',
      priceLineVisible: true,
      lastValueVisible: true,
    });
    
    setChart(chartInstance);
    setSeries(lineSeriesInstance);
    
    return () => {
      chartInstance.remove();
      setChart(null);
      setSeries(null);
    };
  }, [theme]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chart]);
  
  // Update data when selected coin changes
  useEffect(() => {
    if (!chart || !series || !selectedCoin) return;
    
    const mockData = generateMockData(selectedCoin.current_price);
    series.setData(mockData);
    
    chart.applyOptions({
      watermark: {
        visible: true,
        text: selectedCoin.symbol.toUpperCase(),
        fontSize: 48,
        color: theme === 'dark' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(107, 114, 128, 0.1)',
        fontFamily: 'system-ui',
      },
    });
    
    chart.timeScale().fitContent();
  }, [selectedCoin, series, chart, theme]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {selectedCoin ? (
            <div className="flex items-center space-x-2">
              <img 
                src={selectedCoin.image} 
                alt={selectedCoin.name} 
                className="w-6 h-6 rounded-full" 
              />
              <span>{selectedCoin.name} Price Chart</span>
            </div>
          ) : (
            'Select a coin'
          )}
        </h2>
      </div>
      <div ref={chartContainerRef} className="w-full h-[400px]" />
      {!selectedCoin && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50">
          <p className="text-gray-500 dark:text-gray-400">
            Select a cryptocurrency to view its chart
          </p>
        </div>
      )}
    </div>
  );
};

export default Chart;
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchIntradayStockData } from '../services/stockService';
import {
    Chart,
    CategoryScale, 
    LinearScale, 
    LineElement, 
    PointElement, 
    LineController 
} from 'chart.js';
  
Chart.register(
    CategoryScale, 
    LinearScale, 
    LineElement, 
    PointElement, 
    LineController 
);

interface IntradayStockViewProps {
  initialSymbol: string;
}

const IntradayStockView: React.FC<IntradayStockViewProps> = ({ initialSymbol }) => {
  const [symbol, setSymbol] = useState<string>(initialSymbol);
  const [stockData, setStockData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStockData = async () => {
      try {
        const data = await fetchIntradayStockData(symbol);
        setStockData(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch stock data');
      }
    };
    loadStockData();
  }, [symbol]);

  const renderLineChart = () => {
    if (!stockData || !stockData['Time Series (5min)']) {
      return null;
    }

    const timeSeries = stockData['Time Series (5min)'];
    const times = Object.keys(timeSeries).reverse();
    const closingValues = times.map(time => parseFloat(timeSeries[time]['4. close']));

    return (
      <Line
        data={{
          labels: times,
          datasets: [
            {
              label: 'Closing Price',
              data: closingValues,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        }}
      />
    );
  };

  return (
    <div className='flex flex-col items-start'>
      <div className='w-[100%] flex flex-col items-center'>
        <input
          type='text'
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder='Enter Stock Symbol'
          className=' text-center m-3 border-2 border-[#745858] rounded-md'
        />
        <div className='w-[80%]'>
          {error ? <p>{error}</p> : renderLineChart()}
        </div>
      </div>
      
      <h1 className=' text-[3rem]'>Performance</h1>
    </div>
  );
};

export default IntradayStockView;

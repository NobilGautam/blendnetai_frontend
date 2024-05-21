import React, { useEffect, useState } from 'react';
import { fetchBriefStockData } from '../services/stockService';
import axios from 'axios';

interface Stock {
  symbol: string;
  closePrice: string;
}

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userWatchlist, setUserWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const loadStockData = async () => {
      try {
        const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB', 'TSLA', 'BRK.B', 'V', 'JNJ', 'WMT', 'JPM', 'PG', 'UNH', 'DIS', 'NVDA', 'HD', 'MA', 'PYPL', 'VZ', 'ADBE']; // Example list
        const data = await fetchBriefStockData(symbols);
        setStocks(data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    const fetchWatchlist = async () => {
      try {
        const response = await axios.get('/api/watchlist');
        setUserWatchlist(response.data);
      } catch (error) {
        setError('Failed to fetch watchlist');
      }
    };

    loadStockData();
    fetchWatchlist();
  }, []);

  const handleAddToWatchlist = async (symbol: string) => {
    try {
      const response = await axios.post('/api/watchlist', { symbol });
      setUserWatchlist(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to add stock to watchlist');
    }
  };

  return (
    <div>
      <h2>Stock List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {stocks.map(stock => (
            <li key={stock.symbol}>
              <span>{stock.symbol}: {stock.closePrice}</span>
              <button
                onClick={() => handleAddToWatchlist(stock.symbol)}
                disabled={userWatchlist.includes(stock.symbol)}
              >
                {userWatchlist.includes(stock.symbol) ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StockList;

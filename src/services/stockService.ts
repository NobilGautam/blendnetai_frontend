import axios from 'axios';

const BASE_URL = 'https://blendnetai-backend.onrender.com'; // Your backend URL

export const fetchDailyStockData = async (symbol: string) => {
    const response = await axios.get(`${BASE_URL}/daily/${symbol}`);
    return response.data;
};

export const fetchIntradayStockData = async (symbol: string, interval: string = '5min') => {
    const response = await axios.get(`${BASE_URL}/intraday/${symbol}`, {
        params: {
            interval: interval
        }
    });
    return response.data;
};

export const fetchBriefStockData = async (symbols: string[]) => {
    const response = await axios.post('/api/stocks/brief', { symbols });
    return response.data;
};

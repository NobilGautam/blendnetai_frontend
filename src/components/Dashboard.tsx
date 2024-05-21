import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import IntradayStockView from './IntradayStockView';
import { useUserContext } from '../utils/UserContext';

const Dashboard: React.FC = () => {
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [newSymbol, setNewSymbol] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { user, setUser } = useUserContext();
    const BASE_URL = 'http://localhost:4000';

    useEffect(() => {
        if (user) {
            fetchWatchlist();
        }
    }, [user]); // Fetch watchlist when user changes

    const fetchWatchlist = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/watchlist/${user?.username}`);
            setWatchlist(response.data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch watchlist');
        }
    };

    const handleAddStock = async () => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/watchlist`,
                { username: user?.username, symbol: newSymbol }
            );
            setWatchlist(response.data);
            setNewSymbol('');
            setError(null);
        } catch (error) {
            setError('Failed to add stock');
        }
    };

    const handleRemoveStock = async (symbol: string) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/watchlist`, {
                data: { username: user?.username, symbol }
            });
            setWatchlist(response.data);
            setError(null);
        } catch (error) {
            setError('Failed to remove stock');
        }
    };

    const handleLogout = async (e: FormEvent) => {
        setUser(null);
    }

    return (
        <div>
            <h1>My Watchlist</h1>
            {error && <p>{error}</p>}
            <div>
                <button onClick={handleLogout}>logout</button>
            </div>
            <input
                type="text"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                placeholder="Add Stock Symbol"
            />
            <button onClick={handleAddStock}>Add</button>
            <ul>
                {watchlist.map(symbol => (
                    <li key={symbol}>
                        {symbol}
                        <button onClick={() => handleRemoveStock(symbol)}>Remove</button>
                    </li>
                ))}
            </ul>
            {watchlist.map(symbol => (
                <IntradayStockView key={symbol} initialSymbol={symbol} />
            ))}
        </div>
    );
};

export default Dashboard;

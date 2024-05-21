import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import SingleStockRow from './SingleStockRow';
import { useUserContext } from '../utils/UserContext';
import { fetchIntradayStockData } from '../services/stockService';

const Dashboard: React.FC = () => {
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [newSymbol, setNewSymbol] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { user, setUser } = useUserContext();
    const BASE_URL = 'https://api.render.com/deploy/srv-cp6739g21fec738cj3i0?key=ZDPVTxrm2PI';

    useEffect(() => {
        if (user) {
            fetchWatchlist();
        }
    }, [user]);

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
            const stockData = await fetchIntradayStockData(newSymbol);
            if (stockData && stockData["Meta Data"]) {
                const response = await axios.post(
                    `${BASE_URL}/api/watchlist`,
                    { username: user?.username, symbol: newSymbol }
                );
                setWatchlist(response.data);
                setNewSymbol('');
                setError(null);
            } else {
                alert('Symbol data does not exist');
            }
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
    };

    return (
        <div className='bg-[#0e0f1b] h-[200vh] pl-8 pt-8'>
            <div>
                <h1 className='font-bold text-[#ffffff] text-[2.5rem]'>My Watchlist</h1>
                <div>
                    <button className='text-[1.2rem] text-[#ffffff] font-light my-4' onClick={handleLogout}>Logout</button>
                </div>
                <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                    placeholder="Add Stock Symbol"
                    className='bg-transparent border-2 text-[#ffffff] rounded-md p-2 font-light text-[1rem]'
                />
                <button className='bg-[#291f62] ml-2 text-[#ffffff] text-[1rem] p-2 rounded-md px-6 font-bold hover:bg-[#1a0f57] duration-300' onClick={handleAddStock}>Add</button>
                <div className='flex flow-row justify-center mt-10'>
                    {error && <p className='text-red-500'>{error}</p>}
                    <table className='mt-4 w-[80%] text-[#ffffff] bg-[#243070] rounded-xl mb-10'>
                        <thead>
                            <tr className='border-b-2 border-[#ffffff]'>
                                <th className='px-4 py-6 text-[1.2rem] font-outfit'>Name</th>
                                <th className='px-4 py-6 text-[1.2rem] font-outfit'>Symbol</th>
                                <th className='px-4 py-6 text-[1.2rem] font-outfit'>Latest Price</th>
                                <th className='px-4 py-6 text-[1.2rem] font-outfit'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {watchlist.map(symbol => (
                                <SingleStockRow key={symbol} symbol={symbol} onRemove={handleRemoveStock} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { fetchIntradayStockData } from '../services/stockService';
import { Line } from 'react-chartjs-2';
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

interface SingleStockRowProps {
    symbol: string;
    onRemove: (symbol: string) => void;
}

const SingleStockRow: React.FC<SingleStockRowProps> = ({ symbol, onRemove }) => {
    const [stockData, setStockData] = useState<any>(null);
    const [toggle, setToggle] = useState<boolean>(false);

    useEffect(() => {
        const loadStockData = async () => {
            try {
                const data = await fetchIntradayStockData(symbol);
                setStockData(data);
            } catch (error) {
                console.error('Failed to fetch stock data:', error);
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

    const toggleGraph = () => {
        setToggle(!toggle);
    };

    return (
        <>
            <tr>
                <td className='px-4 py-2 text-center'>{symbol}</td>
                <td className='px-4 py-2 text-center'>{stockData && stockData['Meta Data']['2. Symbol']}</td>
                <td className='px-4 py-2 text-center'>{stockData && stockData['Time Series (5min)'][Object.keys(stockData['Time Series (5min)'])[0]]['4. close']}</td>
                <td className='px-4 py-2 text-center'>
                    <button className='mr-2' onClick={() => onRemove(symbol)}>Remove</button>
                    <button onClick={toggleGraph}>{toggle ? 'Collapse' : 'Expand'}</button>
                </td>
            </tr>
            {toggle && (
                <tr>
                    <td colSpan={3}>
                        {renderLineChart()}
                    </td>
                </tr>
            )}
        </>
    );
};

export default SingleStockRow;

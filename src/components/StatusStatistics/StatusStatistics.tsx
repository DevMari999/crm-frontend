import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {fetchStatusStatistics} from '../../slices';
import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {useDispatch} from "../../hooks";

ChartJS.register(ArcElement, Tooltip, Legend);

interface RootState {
    orders: {
        statusStatistics: Array<{ _id: string | null, count: number }>;
    };
}

interface ChartDataState {
    labels: string[];
    datasets: Array<{
        data: number[];
        backgroundColor: string[];
        hoverBackgroundColor: string[];
    }>;
}

export const StatusStatistics: React.FC = () => {
    const dispatch = useDispatch();
    const statusStatistics = useSelector((state: RootState) => state.orders.statusStatistics);
    const [chartData, setChartData] = useState<ChartDataState>({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: [],
            },
        ],
    });

    useEffect(() => {
        dispatch(fetchStatusStatistics());
    }, [dispatch]);

    useEffect(() => {
        if (Array.isArray(statusStatistics) && statusStatistics.length > 0) {
            const labelColorMap: Record<string, string> = {
                'in work': '#dd506e',
                'pending': '#102b3c',
                'completed': '#2d572f',
                'cancelled': 'rgba(64,185,172,0.8)',
                'dubbing': '#f4d15d',
                'new': '#6d1516',
            };

            const labels: string[] = [];
            const data: number[] = [];
            const backgroundColors: string[] = [];

            statusStatistics.forEach(stat => {
                const label = stat._id || 'Unknown';
                const count = stat.count;

                labels.push(label);
                data.push(count);

                backgroundColors.push(labelColorMap[label] || getRandomColor(label));
            });

            setChartData({
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: backgroundColors,
                        hoverBackgroundColor: backgroundColors,
                    },
                ],
            });
        }
    }, [statusStatistics]);

    const getRandomColor = (label: string): string => {
        return '#' + Math.abs(hashCode(label) % 16777215).toString(16);
    };

    const hashCode = (str: string): number => {
        let hash = 0;
        if (str.length === 0) {
            return hash;
        }
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return hash;
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as 'right',
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
    };

    return (
        <div style={{width: '330px', height: '240px'}}>
            <Doughnut data={chartData} options={options}/>
        </div>
    );
};

export default StatusStatistics;

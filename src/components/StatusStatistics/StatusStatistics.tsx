import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import config from "../../configs/configs";
import {ChartDataState, StatusStatistic} from "../../types";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusStatistics: React.FC = () => {
    const [statusStatistics, setStatusStatistics] = useState<StatusStatistic[]>([]);
    const [chartData, setChartData] = useState<ChartDataState>({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: [],
        }],
    });

    useEffect(() => {
        const fetchStatusStatistics = async () => {
            try {
                const response = await fetch(`${config.baseUrl}/api/orders/status-statistics`);
                if (!response.ok) {
                    throw new Error('Failed to fetch status statistics');
                }
                const data = await response.json();
                setStatusStatistics(data);
            } catch (error) {
                console.error('Error fetching status statistics:', error);
            }
        };

        fetchStatusStatistics();
    }, []);

    useEffect(() => {
        if (statusStatistics.length > 0) {
            const labelColorMap: Record<string, string> = {
                'in work': '#a34e17',
                'pending': '#0e2432',
                'completed': '#38553a',
                'cancelled': 'rgba(125,217,203,0.8)',
                'dubbing': '#e0bc58',
                'new': '#7d191a',
            };

            const labels: string[] = statusStatistics.map(stat => stat._id || 'Unknown');
            const data: number[] = statusStatistics.map(stat => stat.count);
            const backgroundColors: string[] = labels.map(label => labelColorMap[label] || getRandomColor(label));

            setChartData({
                labels,
                datasets: [{
                    data,
                    backgroundColor: backgroundColors,
                    hoverBackgroundColor: backgroundColors,
                }],
            });
        }
    }, [statusStatistics]);

    const getRandomColor = (label: string): string => {
        return '#' + Math.abs(hashCode(label) % 16777215).toString(16);
    };

    const hashCode = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
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
                    label: (context: any) => `${context.label}: ${context.parsed}`,
                },
            },
        },
    };

    return (
        <div style={{ width: '330px', height: '240px' }}>
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default StatusStatistics;

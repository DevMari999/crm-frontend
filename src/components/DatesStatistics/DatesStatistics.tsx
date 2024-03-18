import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import './DatesStatistics.css';
import {MonthlyStat} from "../../types";
import config from "../../configs/configs";
Chart.register(...registerables);


const DatesStatistics: React.FC = () => {
    const chartContainer = useRef<HTMLCanvasElement>(null);
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrdersGroupedByMonth = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${config.baseUrl}/api/orders/orders-by-month`);
                if (!response.ok) {
                    throw new Error('Failed to fetch monthly statistics');
                }
                const data = await response.json();
                setMonthlyStats(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Something went wrong');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrdersGroupedByMonth();
    }, []);


    const processData = (): { labels: string[], data: number[] } => {
        const labels: string[] = [];
        const data: number[] = [];

        monthlyStats.forEach(stat => {
            const month = stat._id.month;
            const year = stat._id.year;
            labels.push(`${month}-${year}`);
            data.push(stat.count);
        });

        return { labels, data };
    };

    useEffect(() => {
        if (!isLoading && !error && monthlyStats.length > 0 && chartContainer.current) {
            const { labels, data } = processData();

            const ctx = chartContainer.current.getContext('2d');
            if (ctx) {
                const myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Orders by Month',
                            data: data,
                            fill: false,
                            borderColor: 'rgb(24,219,216)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        plugins: {
                            tooltip: {
                                position: 'nearest',
                                enabled: true,
                                intersect: false,
                                mode: 'nearest',
                            },
                        },
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    parser: 'M-yyyy',
                                    unit: 'month',
                                    displayFormats: {
                                        month: 'MMM yyyy'
                                    }
                                },
                                title: {
                                    display: true,
                                    text: 'Month'
                                }
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Number of Orders'
                                }
                            }
                        }
                    }
                });

                return () => myChart.destroy();
            }
        }
    }, [isLoading, error, monthlyStats]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return <canvas ref={chartContainer} className="chart-container" />;
};

export default DatesStatistics;

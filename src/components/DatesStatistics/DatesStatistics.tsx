import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { RootState } from '../../store/store';
import { fetchOrdersGroupedByMonth } from '../../slices/orders.slice';
import './DatesStatistics.css'
import {useDispatch} from "../../hooks/custom.hooks";
Chart.register(...registerables);

const DatesStatistics: React.FC = () => {
    const dispatch = useDispatch();
    const chartContainer = useRef<HTMLCanvasElement>(null);
    const monthlyStats = useSelector((state: RootState) => state.orders.monthlyStats);

    useEffect(() => {
        dispatch(fetchOrdersGroupedByMonth());
    }, [dispatch]);

    const processData = (): { labels: string[], data: number[] } => {
        const labels: string[] = [];
        const data: number[] = [];

        monthlyStats.forEach((stat: any) => {
            const month = stat._id.month;
            const year = stat._id.year;
            labels.push(`${month}-${year}`);
            data.push(stat.count);
        });

        return { labels, data };
    };

    useEffect(() => {
        if (monthlyStats.length > 0 && chartContainer.current) {
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
    }, [monthlyStats]);

    return (
        <canvas ref={chartContainer} className="chart-container" />

    );
};

export default DatesStatistics;

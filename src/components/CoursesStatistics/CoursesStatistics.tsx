import React, {useState, useEffect, useRef} from 'react';
import Chart from 'chart.js/auto';
import config from "../../configs/configs";
const CoursesStatistics: React.FC = () => {
    const [courseData, setCourseData] = useState<{ courseType: string; count: number }[]>([]);
    const chartContainer = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart>();

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await fetch(`${config.baseUrl}/api/orders/course-type-statistics`);
                if (!response.ok) {
                    throw new Error('Failed to fetch course data');
                }
                const data = await response.json();
                const processedData = data.map((item: { _id: string; count: number }) => ({
                    courseType: item._id !== '' ? item._id : 'Unknown',
                    count: item.count,
                }));
                setCourseData(processedData);
            } catch (error) {
                console.error('Failed to fetch course data:', error);
            }
        };

        fetchCourseData();
    }, []);

    useEffect(() => {
        if (chartContainer.current && courseData.length > 0) {
            const ctx = chartContainer.current.getContext('2d');
            if (ctx) {
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: courseData.map(data => data.courseType),
                        datasets: [{
                            label: 'Course Popularity',
                            data: courseData.map(data => data.count),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Number of Orders',
                                    font: {
                                        size: 11
                                    }
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Course Type',
                                    font: {
                                        size: 11
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [courseData]);

    return (
        <div>
            {courseData.length > 0 && <canvas ref={chartContainer} className="chart-container"/>}
        </div>
    );
};

export default CoursesStatistics;

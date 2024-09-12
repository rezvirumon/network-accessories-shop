import React, { useEffect, useState } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';

// Register required Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Chart = () => {
    const [data, setData] = useState({
        orders: [],
        products: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch orders and products data
                const ordersResponse = await fetch('http://localhost:3001/api/orders');
                const ordersData = await ordersResponse.json();
                
                const productsResponse = await fetch('http://localhost:3001/api/products');
                const productsData = await productsResponse.json();

                setData({
                    orders: ordersData.orders,
                    products: productsData
                });
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    // Process order data for charts
    const getOrderStats = () => {
        const statusCounts = {
            Pending: 0,
            Booked: 0,
            Sale: 0
        };

        data.orders.forEach(order => {
            statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
        });

        return statusCounts;
    };

    // Get orders over time for Line chart
    const getOrderTrends = () => {
        const ordersByDate = {};

        data.orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString(); // Group by day
            ordersByDate[date] = (ordersByDate[date] || 0) + 1;
        });

        return {
            labels: Object.keys(ordersByDate),
            data: Object.values(ordersByDate),
        };
    };

    // Pie chart data
    const pieData = {
        labels: ['Pending Orders', 'Booked Orders', 'Completed Orders'],
        datasets: [{
            label: 'Order Status',
            data: Object.values(getOrderStats()),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)', // Red
                'rgba(54, 162, 235, 0.2)', // Blue
                'rgba(75, 192, 192, 0.2)'  // Green
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',    // Red
                'rgba(54, 162, 235, 1)',    // Blue
                'rgba(75, 192, 192, 1)'     // Green
            ],
            borderWidth: 1,
        }],
    };

    // Bar chart data for product stock
    const barData = {
        labels: data.products.map(product => product.name),
        datasets: [{
            label: 'Product Stock',
            data: data.products.map(product => product.stock),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    // Line chart data for order trends
    const orderTrendsData = {
        labels: getOrderTrends().labels,
        datasets: [{
            label: 'Orders Over Time',
            data: getOrderTrends().data,
            fill: false,
            borderColor: 'rgba(54, 162, 235, 1)',
            tension: 0.1,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to resize
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const label = tooltipItem.label || '';
                        const value = tooltipItem.raw || 0;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
    };

    return (
        <div className="p-24 bg-base-300 rounded-lg shadow-md">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="w-full h-64 md:h-80">
                    <h3 className="text-lg font-semibold mb-2">Order Status Distribution</h3>
                    <Pie data={pieData} options={chartOptions} />
                </div>
                <div className="w-full h-64 md:h-80">
                    <h3 className="text-lg font-semibold mb-2">Product Stock</h3>
                    <Bar data={barData} options={chartOptions} />
                </div>
                <div className="w-full h-64 md:h-80">
                    <h3 className="text-lg font-semibold mb-2">Orders Over Time</h3>
                    <Line data={orderTrendsData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Chart;

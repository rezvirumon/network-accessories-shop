import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaBox, FaEye, FaRegClock, FaCheckCircle, FaTimesCircle, FaDollarSign } from 'react-icons/fa';
import { motion } from 'framer-motion'; // For animations
import { Link } from 'react-router-dom';
import Chart from './Chart';
import PendingOrders from '../PendingOrders/PendingOrders';

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalSales: 0
    });

    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const usersResponse = await axios.get('http://localhost:3001/api/users');
                const totalUsers = usersResponse.data.length;

                const productsResponse = await axios.get('http://localhost:3001/api/products');
                const totalProducts = productsResponse.data.length;

                const ordersResponse = await axios.get('http://localhost:3001/api/orders');
                const orders = ordersResponse.data.orders;

                const totalOrders = orders.length;
                const pendingOrders = orders.filter(order => order.status === 'Pending').length;
                const processingOrders = orders.filter(order => order.status === 'Processing').length;
                const completedOrders = orders.filter(order => order.status === 'Sale').length;
                const cancelledOrders = orders.filter(order => order.status === 'Cancelled').length;

                const totalSales = orders
                    .filter(order => order.status === 'Sale')
                    .reduce((acc, order) => acc + order.payAmount, 0);

                setMetrics({
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    pendingOrders,
                    processingOrders,
                    completedOrders,
                    cancelledOrders,
                    totalSales
                });

                setLoading(false); // Set loading to false after fetching data
            } catch (error) {
                console.error('Error fetching metrics', error);
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const renderCard = (title, value, icon, link, color) => (
        <motion.div className="bg-base-300 hover:bg-base-200 p-4 rounded-lg shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105">
            {icon}
            <div className='flex w-full justify-between items-center'>
                <div>
                    <h2 className="text-xl font-semibold">{title}</h2>
                    {loading ? (
                        <p className="text-xl font-bold mt-2 ">
                            <span className="loading loading-ball loading-xs"></span>
                            <span className="loading loading-ball loading-sm"></span>
                            <span className="loading loading-ball loading-md"></span>
                            <span className="loading loading-ball loading-lg"></span>
                        </p>
                    ) : (
                        <p className="text-3xl font-bold mt-2">{value}</p>
                    )}
                </div>
                <div>
                    <Link to={link} className={`btn rounded-full text-${color}-500 font-extrabold text-xl`}>
                        <FaEye />
                    </Link>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Users */}
                {renderCard('Total Users', metrics.totalUsers, <FaUsers className="text-4xl text-blue-500" />, '/admin/accounts', 'blue')}

                {/* Total Products */}
                {renderCard('Total Products', metrics.totalProducts, <FaBox className="text-4xl text-green-500" />, '/admin/managed-products', 'green')}

                {/* Total Orders */}
                {renderCard('Total Orders', metrics.totalOrders, <FaRegClock className="text-4xl text-yellow-500" />, '/admin/orders', 'yellow')}

                {/* Pending Orders */}
                {renderCard('Pending Orders', metrics.pendingOrders, <FaRegClock className="text-4xl text-yellow-500" />, '/admin/orders?status=pending', 'yellow')}

                {/* Processing Orders */}
                {renderCard('Processing Orders', metrics.processingOrders, <FaTimesCircle className="text-4xl text-red-500" />, '/admin/orders?status=processing', 'red')}

                {/* Completed Orders */}
                {renderCard('Completed Orders', metrics.completedOrders, <FaCheckCircle className="text-4xl text-green-500" />, '/admin/orders?status=sale', 'green')}

                {/* Cancelled Orders */}
                {renderCard('Cancelled Orders', metrics.cancelledOrders, <FaTimesCircle className="text-4xl text-red-500" />, '/admin/orders?status=cancelled', 'red')}

                {/* Total Sales */}
                {renderCard('Total Sales', `$${metrics.totalSales}`, <FaDollarSign className="text-4xl text-green-500" />, '/admin/orders?status=sale', 'green')}
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Sales Overview</h2>
                <Chart />
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>
                <PendingOrders />
            </div>
        </div>
    );
};

export default Dashboard;

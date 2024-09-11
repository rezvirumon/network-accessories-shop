import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaBox, FaEye, FaRegClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion'; // For animations
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa6';
import Chart from './Chart';
import PendingOrders from '../PendingOrders/PendingOrders';

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        bookedOrders: 0,
        completedOrders: 0
    });

    useEffect(() => {
        // Fetch metrics from APIs
        const fetchMetrics = async () => {
            try {
                // Fetch users count
                const usersResponse = await axios.get('http://localhost:3001/api/users');
                const totalUsers = usersResponse.data.length;

                // Fetch products count
                const productsResponse = await axios.get('http://localhost:3001/api/products');
                const totalProducts = productsResponse.data.length;

                // Fetch orders and calculate metrics
                const ordersResponse = await axios.get('http://localhost:3001/api/orders');
                const orders = ordersResponse.data.orders;

                const totalOrders = orders.length;
                const pendingOrders = orders.filter(order => order.status === 'Pending').length;
                const bookedOrders = orders.filter(order => order.status === 'Booked').length;
                const completedOrders = orders.filter(order => order.status === 'Sale').length;

                setMetrics({
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    pendingOrders,
                    bookedOrders,
                    completedOrders
                });
            } catch (error) {
                console.error('Error fetching metrics', error);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                    className="bg-base-300 hover:bg-base-200 p-4 rounded-lg shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaUsers className="text-4xl text-blue-500" />
                    <div className='flex w-full justify-between items-center'>
                        <div>
                            <h2 className="text-xl font-semibold">Total Users</h2>
                            <p className="text-3xl font-bold mt-2">{metrics.totalUsers}</p>
                        </div>
                        <div>
                            <Link to='/admin/accounts' className='btn rounded-full text-blue-500 font-extrabold text-xl'>
                                <FaEye />
                            </Link>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    className="bg-base-300 hover:bg-base-200 p-4 rounded-lg shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaBox className="text-4xl text-green-500" />
                    <div className='flex w-full justify-between items-center'>
                        <div>
                            <h2 className="text-xl font-semibold">Total Products</h2>
                            <p className="text-3xl font-bold mt-2">{metrics.totalProducts}</p>
                        </div>
                        <div>
                            <Link to='/admin/managed-products' className='btn rounded-full text-green-500 font-extrabold text-xl'>
                                <FaPlus />
                            </Link>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    className="bg-base-300 hover:bg-base-200 p-4 rounded-lg shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaRegClock className="text-4xl text-yellow-500" />
                    <div className='flex w-full justify-between items-center'>
                        <div>
                            <h2 className="text-xl font-semibold">Total Orders</h2>
                            <p className="text-3xl font-bold mt-2">{metrics.totalOrders}</p>
                        </div>
                        <div>
                            <Link to='/admin/orders' className='btn rounded-full text-yellow-500 font-extrabold text-xl'>
                                <FaEye />
                            </Link>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    className="bg-base-300 hover:bg-base-200 p-4 rounded-lg shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaRegClock className="text-4xl text-yellow-500" />
                    <div className='flex w-full justify-between items-center'>
                        <div>
                            <h2 className="text-xl font-semibold">Pending Orders</h2>
                            <p className="text-3xl font-bold mt-2">{metrics.pendingOrders}</p>
                        </div>
                        <div>
                            <Link to='/admin/orders?status=pending' className='btn rounded-full text-yellow-500 font-extrabold text-xl'>
                                <FaEye />
                            </Link>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    className="bg-base-300 hover:bg-base-200 p-4 rounded-lg shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaTimesCircle className="text-4xl text-red-500" />
                    <div className='flex w-full justify-between items-center'>
                        <div>
                            <h2 className="text-xl font-semibold">Booked Orders</h2>
                            <p className="text-3xl font-bold mt-2">{metrics.bookedOrders}</p>
                        </div>
                        <div>
                            <Link to='/admin/orders?status=booked' className='btn rounded-full text-red-500 font-extrabold text-xl'>
                                <FaEye />
                            </Link>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    className="bg-base-300 hover:bg-base-200 p-4 rounded-lg shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaCheckCircle className="text-4xl text-green-500" />
                    <div className='flex w-full justify-between items-center'>
                        <div>
                            <h2 className="text-xl font-semibold">Completed Orders</h2>
                            <p className="text-3xl font-bold mt-2">{metrics.completedOrders}</p>
                        </div>
                        <div>
                            <Link to='/admin/orders?status=sale' className='btn rounded-full text-green-500 font-extrabold text-xl'>
                                <FaEye />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
            <div className='my-6'>
                <Chart></Chart>
            </div>
            <div className='my-6'>
                <PendingOrders></PendingOrders>
            </div>
        </div>
    );
};

export default Dashboard;

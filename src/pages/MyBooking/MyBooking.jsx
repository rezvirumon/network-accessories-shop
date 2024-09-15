import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthProvider';
import { FaClock, FaCheckCircle, FaGift, FaTimes, FaUndo, FaCheck } from 'react-icons/fa';

const MyBooking = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
        if (!loading && user) {
            const fetchOrders = async () => {
                try {
                    const response = await axios.get('http://localhost:3001/api/orders');
                    const ordersData = response.data.orders;
                    if (Array.isArray(ordersData)) {
                        const userOrders = ordersData.filter(order => order.userEmail === user.email);
                        setOrders(userOrders);
                        setFilteredOrders(userOrders);
                    } else {
                        setError('Unexpected response format: orders property is not an array');
                    }
                } catch (error) {
                    setError(`Error fetching user orders: ${error.message}`);
                }
            };

            fetchOrders();
        }
    }, [loading, user]);

    useEffect(() => {
        if (selectedStatus === "All") {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === selectedStatus));
        }
    }, [selectedStatus, orders]);

    useEffect(() => {
        if (selectedOrder) {
            const fetchOrderDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/orders/${selectedOrder}`);
                    setOrderDetails(response.data.order);
                } catch (error) {
                    setError('Error fetching order details');
                }
            };
            fetchOrderDetails();
        }
    }, [selectedOrder]);

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleViewDetails = (orderId) => {
        setSelectedOrder(orderId);
    };

    const handleCloseDetails = () => {
        setSelectedOrder(null);
        setOrderDetails(null);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 overflow-auto w-[95vw] lg:w-full mx-auto bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center text-gray-800">My Bookings</h1>

            {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
            ) : !user ? (
                <p className="text-center text-gray-600">Please log in to view your bookings.</p>
            ) : error ? (
                <p className="text-center text-red-600">{error}</p>
            ) : (
                <>
                    <div className="mb-4">
                        <select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Booked">Booked</option>
                            <option value="Sale">Sale</option>
                            <option value="Canceled">Canceled</option>
                            <option value="Returned">Returned</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="lg:min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                            <thead className="bg-gray-200 text-sm md:text-base">
                                <tr>
                                    <th className="py-2 px-3 border-b">Order ID</th>
                                    <th className="py-2 px-3 border-b">Email</th>
                                    <th className="py-2 px-3 border-b">Status</th>
                                    <th className="py-2 px-3 border-b">Booking Date</th>
                                 
                                    <th className="py-2 px-3 border-b">Details</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm md:text-base">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-100 transition-colors duration-300">
                                            <td className="py-2 px-3 border-b text-gray-700">{order._id}</td>
                                            <td className="py-2 px-3 border-b text-gray-700">{order.userEmail}</td>
                                            <td className="py-2 px-3 border-b text-gray-700">
                                                {order.status === 'Pending' && <FaClock className="text-yellow-500" title="Pending" />}
                                                {order.status === 'Booked' && <FaCheckCircle className="text-blue-500" title="Booked" />}
                                                {order.status === 'Sale' && <FaGift className="text-green-500" title="Sale" />}
                                                {order.status === 'Canceled' && <FaTimes className="text-red-500" title="Canceled" />}
                                                {order.status === 'Returned' && <FaUndo className="text-orange-500" title="Returned" />}
                                                {order.status === 'Completed' && <FaCheck className="text-purple-500" title="Completed" />}
                                            </td>
                                            <td className="py-2 px-3 border-b text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="py-2 px-3 border-b">
                                                <button
                                                    onClick={() => handleViewDetails(order._id)}
                                                    className="bg-blue-500 text-white py-1 px-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 text-xs md:text-sm"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-2 px-3 border-b text-center text-gray-600">No bookings found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {selectedOrder && orderDetails && (
                        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
                            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl md:text-2xl font-bold">Order Details</h2>
                                    <button
                                        onClick={handleCloseDetails}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <FaTimes size={24} />
                                    </button>
                                </div>
                                <p><strong>Order ID:</strong> {orderDetails._id}</p>
                                <p><strong>Email:</strong> {orderDetails.userEmail}</p>
                                <p><strong>Status:</strong> {orderDetails.status}</p>
                                <p><strong>Booking Date:</strong> {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                                <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>
                                <p><strong>Total Amount:</strong> {orderDetails.payAmount}</p>
                                <p><strong>Due Amount:</strong> {orderDetails.dueAmount}</p>
                                <p><strong>Products:</strong></p>
                                <ul className="list-disc list-inside ml-4">
                                    {(orderDetails.products || []).map((product, index) => (
                                        <li key={index} className="flex items-center mb-2 text-sm md:text-base">
                                            <img
                                                src={product.product.images[0]}
                                                alt={product.product.name}
                                                className="w-12 h-12 md:w-16 md:h-16 object-cover mr-3 rounded"
                                            />
                                            <span>{product.product.name} - {product.quantity} x ${product.product.price}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4">
                                    <button
                                        onClick={handleCloseDetails}
                                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyBooking;

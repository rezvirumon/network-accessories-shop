import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthProvider'; // Import AuthContext
import { FaClock, FaCheckCircle, FaGift, FaTimes, FaUndo, FaCheck } from 'react-icons/fa'; // Import additional icons

const MyBooking = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [error, setError] = useState(null); // Added error state
    const [selectedStatus, setSelectedStatus] = useState("All"); // State for selected status
    const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order
    const [orderDetails, setOrderDetails] = useState(null); // State for order details
    const { user, loading } = useContext(AuthContext); // Access user from AuthContext

    useEffect(() => {
        if (!loading && user) {
            const fetchOrders = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/orders?userEmail=${user.email}`);
                    setOrders(response.data.orders);
                    setFilteredOrders(response.data.orders); // Initialize filteredOrders
                } catch (error) {
                    setError('Error fetching user orders');
                    console.error('Error fetching user orders:', error);
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
                    console.error('Error fetching order details:', error);
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
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">My Bookings</h1>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : !user ? (
                <p className="text-center">Please log in to view your bookings.</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <>
                    <div className="mb-4">
                        <select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
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
                    <table className="min-w-full bg-base-200 border text-center border-gray-200">
                        <thead className="bg-base-300">
                            <tr>
                                <th className="py-2 px-4 border-b">Order ID</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Booking Date</th>
                                <th className="py-2 px-4 border-b">Order Status</th> {/* Updated column header */}
                                <th className="py-2 px-4 border-b">Details</th> {/* New column for details */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-base-300">
                                        <td className="py-2 px-4 border-b">{order._id}</td>
                                        <td className="py-2 px-4 border-b">{order.status}</td>
                                        <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border-b">
                                            {order.status === 'Pending' && (
                                                <FaClock className="text-yellow-500 mx-auto" title="Pending" />
                                            )}
                                            {order.status === 'Booked' && (
                                                <FaCheckCircle className="text-blue-500 mx-auto" title="Booked" />
                                            )}
                                            {order.status === 'Sale' && (
                                                <FaGift className="text-green-500 mx-auto" title="Delivered" />
                                            )}
                                            {order.status === 'Canceled' && (
                                                <FaTimes className="text-red-500 mx-auto" title="Canceled" />
                                            )}
                                            {order.status === 'Returned' && (
                                                <FaUndo className="text-orange-500 mx-auto" title="Returned" />
                                            )}
                                            {order.status === 'Completed' && (
                                                <FaCheck className="text-purple-500 mx-auto" title="Completed" />
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => handleViewDetails(order._id)}
                                                className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-2 px-4 border-b text-center">No bookings found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {selectedOrder && orderDetails && (
                        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                                <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                                <p><strong>Order ID:</strong> {orderDetails._id}</p>
                                <p><strong>Status:</strong> {orderDetails.status}</p>
                                <p><strong>Booking Date:</strong> {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                                <p><strong>Products:</strong></p>
                                <ul className="list-disc ml-5">
                                    {orderDetails.products && orderDetails.products.map((product, index) => (
                                        <li key={index} className="flex items-center space-x-4">
                                            {product.product.images && product.product.images.length > 0 ? (
                                                <img src={product.product.images[0]} alt={product.product.name} className="w-16 h-16 object-cover" />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-300 flex items-center justify-center">
                                                    <span>No Image</span>
                                                </div>
                                            )}
                                            <div>
                                                <p>{product.product.name}</p>
                                                <p>{product.quantity} x ${product.price}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4">
                                    <button
                                        onClick={handleCloseDetails}
                                        className="bg-gray-500 text-white py-1 px-3 rounded-lg"
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

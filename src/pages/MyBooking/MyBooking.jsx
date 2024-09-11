import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthProvider'; // Import AuthContext
import { FaClock, FaCheckCircle, FaGift } from 'react-icons/fa'; // Import additional icons

const MyBooking = () => {
    const [orders, setOrders] = useState([]);
    const { user, loading } = useContext(AuthContext); // Access user from AuthContext

    useEffect(() => {
        if (!loading && user) {
            const fetchOrders = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/orders/user/${user.email}`);
                    setOrders(response.data.orders);
                } catch (error) {
                    console.error('Error fetching user orders:', error);
                }
            };

            fetchOrders();
        }
    }, [loading, user]);

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">My Bookings</h1>
            {loading ? (
                <p>Loading...</p>
            ) : !user ? (
                <p>Please log in to view your bookings.</p>
            ) : (
                <table className="min-w-full bg-base-200 border text-center border-gray-200">
                    <thead className='bg-base-300'>
                        <tr>
                            <th className="py-2 px-4 border-b">Order ID</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Booking Date</th>
                            <th className="py-2 px-4 border-b">Order Satus</th> {/* Updated column header */}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order._id} className='hover:bg-base-300'>
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
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-2 px-4 border-b">No bookings found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyBooking;

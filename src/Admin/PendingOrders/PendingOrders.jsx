import React, { useEffect, useState } from 'react';

const PendingOrders = () => {
    const [pendingOrders, setPendingOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch orders data
                const response = await fetch('http://localhost:3001/api/orders');
                const data = await response.json();
                
                // Filter and sort pending orders
                const filteredOrders = data.orders
                    .filter(order => order.status === 'Pending')
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Assuming orders have a createdAt field

                setPendingOrders(filteredOrders);
            } catch (error) {
                console.error('Error fetching orders', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="p-5 bg-base-300 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Pending Orders</h2>
            {pendingOrders.length > 0 ? (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-base-200">
                            <th className="p-2 border">Order ID</th>
                            <th className="p-2 border">Email</th>
                            
                            <th className="p-2 border">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingOrders.map(order => (
                            <tr key={order._id} className="hover:bg-base-100">
                                <td className="p-2 border">{order._id}</td>
                                <td className="p-2 border">{order.userEmail}</td>
                            
                                <td className="p-2 border">{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No pending orders at the moment.</p>
            )}
        </div>
    );
};

export default PendingOrders;

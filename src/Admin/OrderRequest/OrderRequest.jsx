import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const OrderRequest = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch orders from API
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:3001/api/orders?page=${page}`);
            setOrders(data.orders);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page]);

    // Handle order status update
    const updateOrderStatus = async (orderId, status) => {
        try {
            await axios.patch(`http://localhost:3001/api/orders/${orderId}`, { status });
            Swal.fire('Success', `Order status updated to ${status}`, 'success');
            fetchOrders(); // Refresh orders after update
        } catch (error) {
            Swal.fire('Error', 'Failed to update order status', 'error');
        }
    };

    // Handle order deletion
    const deleteOrder = async (orderId) => {
        try {
            await axios.delete(`http://localhost:3001/api/orders/${orderId}`);
            Swal.fire('Deleted!', 'Order has been deleted.', 'success');
            fetchOrders(); // Refresh orders after deletion
        } catch (error) {
            Swal.fire('Error', 'Failed to delete order', 'error');
        }
    };

    // Render product details
    const renderProductDetails = (products) => {
        return products.map((product, index) => (
            <div key={index} className="flex items-center space-x-4">
                <img src={product.product.images[0]} alt={product.product.name} className="w-16 h-16 object-cover" />
                <div className="text-sm">
                    <p className="font-medium">{product.product.name}</p>
                    <p className="text-gray-500">{product.product.category}</p>
                </div>
            </div>
        ));
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing':
                return 'bg-purple-200 text-purple-800';
            case 'Sale':
                return 'bg-green-200 text-green-800';
            case 'Cancelled':
                return 'bg-red-200 text-red-800';
            default:
                return 'bg-yellow-200 text-yellow-800';
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Order Requests</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OrderID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className=" divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userEmail}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {renderProductDetails(order.products)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.products.reduce((acc, p) => acc + p.quantity, 0)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.products.reduce((acc, p) => acc + p.price, 0)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.payAmount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                                        onClick={() => updateOrderStatus(order._id, 'Processing')}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-600"
                                        onClick={() => updateOrderStatus(order._id, 'Sale')}
                                    >
                                        Sale
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
                                        onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                        onClick={() => deleteOrder(order._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
                    disabled={page === 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Previous
                </button>
                <span className="mx-2 text-sm">Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage(prevPage => Math.min(prevPage + 1, totalPages))}
                    disabled={page === totalPages}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default OrderRequest;

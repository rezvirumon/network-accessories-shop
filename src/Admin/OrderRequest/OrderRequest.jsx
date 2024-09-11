import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const OrderRequest = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/orders');
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                Swal.fire('Error', 'Failed to fetch orders.', 'error');
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                Swal.fire('Error', 'Failed to fetch products.', 'error');
            }
        };

        fetchOrders();
        fetchProducts();
    }, []);

    const handleUpdateStatus = async (orderId, status, productId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `You want to mark this order as ${status}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, update it!',
            });

            if (result.isConfirmed) {
                // Update order status
                await axios.patch(`http://localhost:3001/api/orders/${orderId}`, { status });
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, status } : order
                    )
                );

                if (status === 'Sale') {
                    // Find the product and update its stock
                    const product = products.find(p => p._id === productId);
                    if (product) {
                        if (product.stock > 0) {
                            await axios.put(`http://localhost:3001/api/products/${productId}`, {
                                stock: product.stock - 1
                            });
                            setProducts((prevProducts) =>
                                prevProducts.map((p) =>
                                    p._id === productId ? { ...p, stock: p.stock - 1 } : p
                                )
                            );
                        } else {
                            Swal.fire('Error', 'Insufficient stock to fulfill this order.', 'error');
                        }
                    }
                }

                Swal.fire('Updated!', `Order status has been changed to ${status}.`, 'success');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            Swal.fire('Error', 'Failed to update order status.', 'error');
        }
    };

    const sortedOrders = [...orders].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
    });

    const paginatedOrders = sortedOrders.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Order Requests</h1>
            <table className="min-w-full bg-base-200 border text-center border-gray-200">
                <thead className='bg-base-300'>
                    <tr>
                        <th className="py-2 px-4 border-b" onClick={() => setSortConfig({ key: '_id', direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending' })}>
                            Order ID {sortConfig.key === '_id' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                        </th>
                        <th className="py-2 px-4 border-b" onClick={() => setSortConfig({ key: 'userEmail', direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending' })}>
                            Request Email {sortConfig.key === 'userEmail' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                        </th>
                        <th className="py-2 px-4 border-b" onClick={() => setSortConfig({ key: 'status', direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending' })}>
                            Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                        </th>
                        <th className="py-2 px-4 border-b" onClick={() => setSortConfig({ key: 'createdAt', direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending' })}>
                            Created At {sortConfig.key === 'createdAt' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                        </th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
                        <tr key={order._id} className='hover:bg-base-300'>
                            <td className="py-2 px-4 border-b">{order._id}</td>
                            <td className="py-2 px-4 border-b">{order.userEmail}</td>
                            <td className="py-2 px-4 border-b">{order.status}</td>
                            <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded"
                                    onClick={() => handleUpdateStatus(order._id, 'Booked', order.productId)}
                                >
                                    Mark as Booked
                                </button>
                                <button
                                    className="bg-green-500 text-white py-2 px-4 rounded ml-2"
                                    onClick={() => handleUpdateStatus(order._id, 'Sale', order.productId)}
                                >
                                    Mark as Sale
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="py-2 px-4 border-b text-center">No orders available</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between items-center">
                <div>
                    <button
                        className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                        onClick={() => setCurrentPage(0)}
                        disabled={currentPage === 0}
                    >
                        {'<<'}
                    </button>
                    <button
                        className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        {'<'}
                    </button>
                    <button
                        className="bg-gray-500 text-white py-2 px-4 rounded"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={(currentPage + 1) * itemsPerPage >= orders.length}
                    >
                        {'>'}
                    </button>
                    <button
                        className="bg-gray-500 text-white py-2 px-4 rounded ml-2"
                        onClick={() => setCurrentPage(Math.ceil(orders.length / itemsPerPage) - 1)}
                        disabled={(currentPage + 1) * itemsPerPage >= orders.length}
                    >
                        {'>>'}
                    </button>
                </div>
                <div>
                    <select
                        value={itemsPerPage}
                        onChange={e => setItemsPerPage(Number(e.target.value))}
                        className="py-2 px-4 rounded border border-gray-300"
                    >
                        {[5, 10, 15, 20].map(num => (
                            <option key={num} value={num}>{num} per page</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default OrderRequest;

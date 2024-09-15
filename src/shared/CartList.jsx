import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';
import axios from 'axios';
import useAuth from '../hooks/useAuth'; // Import useAuth

const CartList = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const { user, loading } = useAuth(); // Access current logged-in user

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
        calculateTotal(storedCart);
    }, []);

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
    };

    const handleRemoveItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        calculateTotal(updatedCart);
    };

    const handleQuantityChange = (id, amount) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                const updatedQuantity = item.quantity + amount;
                const newQuantity = Math.max(updatedQuantity, 1);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        calculateTotal(updatedCart);
    };

    const handleCheckout = async () => {
        if (!user) {
            alert('You need to log in to place an order.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/orders', {
                products: cartItems.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                userEmail: user.email,
                userMobile: user.mobile,
                userUID: user.uid,
                paymentMethod: 'Cash on Delivery',
                payAmount: totalPrice
            });

            if (response.data.success) {
                localStorage.removeItem('cart');
                setCartItems([]);
                setTotalPrice(0);
                alert('Order placed successfully');
            } else {
                alert('Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order');
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 lg:px-8 py-4 w-[95vw]">
            <h3 className="text-center my-3 text-xl font-bold py-3 text-yellow-600">
                Your Cart <span>({cartItems.length}) items</span>
            </h3>
            <div className="overflow-x-auto">
                <table className="table w-full border-collapse md:table-fixed">
                    <thead className="bg-gray-100 text-sm md:text-base">
                        <tr>
                            <th className="py-2 px-4 border-b">Item</th>
                            <th className="py-2 px-4 border-b">Price</th>
                            <th className="py-2 px-4 border-b">Quantity</th>
                            <th className="py-2 px-4 border-b">Total</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm md:text-base">
                        {cartItems.map((item) => (
                            <tr key={item.id}>
                                <td className="py-2 px-4 border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img src={item.images[0]} alt="product" className="object-cover" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold">{item.name}</div>
                                            <div className="text-sm text-yellow-600">{item.description}</div>
                                            <div className="text-xs opacity-50">Category: {item.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <span className="flex items-center gap-2"><FaBangladeshiTakaSign />{item.price}</span>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div className="flex items-center justify-between border rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                            className="px-3 py-1 text-xl font-semibold disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, 1)}
                                            className="px-3 py-1 text-xl font-semibold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <span className="flex items-center gap-2"><FaBangladeshiTakaSign />{item.price * item.quantity}</span>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <IoClose size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="text-right mt-4">
                    <h3 className="text-lg md:text-xl">Total: <span className="flex items-center gap-2"><FaBangladeshiTakaSign />{totalPrice}</span></h3>
                    <button
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg mt-3 text-sm md:text-base"
                        onClick={handleCheckout}
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartList;

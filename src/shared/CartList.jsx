import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider'; // Import AuthContext
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const CartList = () => {
    const [cart, setCart] = useState([]);
    const [bookingStatus, setBookingStatus] = useState('');
    const { user } = useContext(AuthContext);  // Get the logged-in user details
    const navigate = useNavigate();

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartItems);
    }, []);

    const handleRemoveItem = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const handleBooking = async () => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to place this booking?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, book it!',
            });

            if (result.isConfirmed) {
                // Send cart items and user email/UID to the backend
                const response = await axios.post('http://localhost:3001/api/orders', {
                    cartItems: cart,
                    status: 'Pending',
                    userEmail: user?.email,  // Send logged-in user email
                    userUID: user?.uid       // Send logged-in user UID
                });

                if (response.data.success) {
                    setBookingStatus('Pending');
                    localStorage.removeItem('cart');
                    Swal.fire('Booked!', 'Your booking has been placed.', 'success');
                }
            }
        } catch (error) {
            console.error('Error while booking:', error);
            Swal.fire('Error', 'There was an error processing your booking.', 'error');
        }
    };

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <table className="min-w-full bg-base-200 border text-center border-gray-200">
                        <thead className='bg-base-300'>
                            <tr>
                                <th className="py-2 px-4 border-b">Product</th>
                                <th className="py-2 px-4 border-b">Price</th>
                                <th className="py-2 px-4 border-b">Quantity</th>
                                <th className="py-2 px-4 border-b">Total</th>
                                <th className="py-2 px-4 border-b">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, index) => (
                                <tr key={index} className='hover:bg-base-300'>
                                    <td className="py-2 px-4 border-b">{item.name}</td>
                                    <td className="py-2 px-4 border-b">${item.price.toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b">{item.quantity}</td>
                                    <td className="py-2 px-4 border-b">${(item.price * item.quantity).toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleRemoveItem(index)}
                                        >
                                            <FaTimes />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-xl font-semibold">Total: ${calculateTotal()}</span>
                        <button
                            className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg"
                            onClick={handleBooking}
                        >
                            Booking
                        </button>
                    </div>

                    {bookingStatus && (
                        <div className="mt-4">
                            <p>Booking Status: {bookingStatus}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CartList;

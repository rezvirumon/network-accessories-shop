import React, { useState, useContext, useEffect } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaCartPlus } from 'react-icons/fa';
import CartList from './CartList';
import { AuthContext } from '../context/AuthProvider';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        // Load cart from local storage and count items
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(itemCount);
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
                {/* Left Side - Logo / Search */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-4 py-2 w-64 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring focus:ring-gray-500"
                        />
                        <FaSearch className="absolute top-3 right-4 text-gray-400" />
                    </div>
                </div>

                {/* Right Side - Icons */}
                <div className="flex items-center gap-4">
                    {/* Cart Icon with Badge */}
                    <div
                        className="relative cursor-pointer"
                        onClick={() => setIsCartOpen(!isCartOpen)}
                    >
                        <Link to='/cart'>
                            <FaCartPlus className="text-xl" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Notification Icon */}
                    <div className="relative cursor-pointer">
                        <FaBell className="text-xl" />
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">3</span>
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <FaUserCircle
                            className="text-2xl cursor-pointer"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        />
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg">
                                <ul className="py-2">
                                    {user ? (
                                        <>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                <Link to="/profile">Profile</Link>
                                            </li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                <Link to="/settings">Settings</Link>
                                            </li>
                                            {user.role === 'Admin' && (
                                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                    <Link to="/admin">Admin Dashboard</Link>
                                                </li>
                                            )}
                                            <li
                                                onClick={handleLogout}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                Logout
                                            </li>
                                        </>
                                    ) : (
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <Link to="/signin">Login</Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>


        </div>
    );
};

export default Navbar;

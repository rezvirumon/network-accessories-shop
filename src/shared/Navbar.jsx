import React, { useState, useContext, useEffect } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaCartPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed
import { AuthContext } from '../context/AuthProvider';
import SearchBar from './SearchBar';


const Navbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [error, setError] = useState(null); // Added error state for suggestion fetching
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
        <nav className="bg-gradient-to-r from-purple-800 to-indigo-600 text-white p-4 flex items-center justify-between shadow-lg">
            {/* Left Side - Logo / Search */}
            <div className="flex items-center gap-4">
               <SearchBar></SearchBar>
            </div>

            {/* Right Side - Icons */}
            <div className="flex items-center gap-4">
                {/* Cart Icon with Badge */}
                <div className="relative cursor-pointer" onClick={() => setIsCartOpen(!isCartOpen)}>
                    <Link to='/cart'>
                        <FaCartPlus className="text-xl" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-1 transition-transform transform scale-100">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Notification Icon */}
                <div className="relative cursor-pointer">
                    <FaBell className="text-xl" />
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-1 transition-transform transform scale-100">3</span>
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                    <FaUserCircle
                        className="text-2xl cursor-pointer"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    />
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg transition-transform transform scale-95">
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
                                        <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
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
    );
};

export default Navbar;

import React, { useState } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaCartPlus } from 'react-icons/fa';
import CartList from './CartList'; // Import your CartList component

const Navbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false); // State to manage cart visibility

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
                    {/* Add to Cart Icon */}
                    <div
                        className="relative cursor-pointer"
                        onClick={() => setIsCartOpen(!isCartOpen)} // Toggle cart on click
                    >
                        <FaCartPlus className="text-xl" />
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">3</span>
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
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Cart List - Conditional Rendering */}
            {isCartOpen && (
                <div className="absolute right-0 top-16 w-80 bg-white text-gray-700 rounded-lg shadow-lg p-4">
                    <CartList /> {/* Display CartList when the cart icon is clicked */}
                </div>
            )}
        </div>
    );
};

export default Navbar;

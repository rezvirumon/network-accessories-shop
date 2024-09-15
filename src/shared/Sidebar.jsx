import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaBars, FaChevronDown, FaTimes, FaUsersCog } from 'react-icons/fa';
import { MdContactSupport, MdOutlineAddShoppingCart, MdOutlineShoppingCartCheckout } from 'react-icons/md';
import { AuthContext } from '../context/AuthProvider'; // Import AuthContext
import { TbShoppingCartBolt, TbShoppingCartCheck } from 'react-icons/tb';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false); // Sidebar closed by default on small screens
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const { user } = useContext(AuthContext); // Access user context

    const toggleSidebar = () => setIsOpen(!isOpen);
    
    const closeSidebarOnLinkClick = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    return (
        <div className="flex ">
            {/* Small screen toggle button */}
            {!isOpen && (
                <FaBars
                    className="lg:hidden fixed top-4 left-2 z-50 w-7 h-7 text-white cursor-pointer"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                className={`bg-gradient-to-b from-purple-900 to-indigo-600 text-white h-screen p-5 pt-8 ${isOpen ? 'w-64' : 'lg:left-0 -left-16 w-0'} lg:w-64 fixed lg:relative z-50 lg:z-auto transition-all duration-500 ease-in-out`}
            >
                {/* Close icon for small screens */}
                {isOpen && (
                    <FaTimes
                        className="lg:hidden absolute cursor-pointer top-4 right-4 w-7 h-7 text-white"
                        onClick={toggleSidebar}
                    />
                )}

                {/* Logo Section */}
                <div className={`flex items-center ${!isOpen && 'opacity-0 lg:opacity-100'} transition-opacity duration-300`}>
                    <h1 className={`text-2xl font-bold w-full text-center p-3`}>
                        Visual Tech
                    </h1>
                </div>

                {/* Menu Items */}
                <ul className={`pt-6 ${!isOpen && 'hidden lg:block'}`}>
                    {/* Normal User Menus */}
                    <li onClick={closeSidebarOnLinkClick} className="group relative text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-2 transition-colors duration-200">
                        <Link to='/' className="flex items-center gap-x-4 w-full">
                            <FaHome className="w-5 h-5" />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li onClick={closeSidebarOnLinkClick} className="group relative text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-2 transition-colors duration-200">
                        <Link to='/products' className="flex items-center gap-x-4 w-full">
                            <FaShoppingCart className="w-5 h-5" />
                            <span>Products</span>
                        </Link>
                    </li>
                    <li onClick={closeSidebarOnLinkClick} className="group relative text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-2 transition-colors duration-200">
                        <Link to='/my-booking' className="flex items-center gap-x-4 w-full">
                            <TbShoppingCartCheck className="w-5 h-5" />
                            <span>My Booking</span>
                        </Link>
                    </li>
                    {/* Submenu for Support */}
                    <li className="text-gray-300 text-sm flex flex-col gap-x-4 cursor-pointer p-2 mt-2 hover:bg-gray-700 rounded-md transition-colors duration-200">
                        <div className="flex items-center justify-between" onClick={() => setSubmenuOpen(!submenuOpen)}>
                            <div className="flex items-center gap-x-4">
                                <MdContactSupport className="w-5 h-5" />
                                <span>Support</span>
                            </div>
                            <FaChevronDown className={`transition-transform duration-300 ${submenuOpen && 'rotate-180'}`} />
                        </div>
                        {/* Submenu Items */}
                        {submenuOpen && (
                            <ul className="pl-8">
                                <li className="text-gray-300 text-sm py-1 hover:text-white">FAQ</li>
                                <li className="text-gray-300 text-sm py-1 hover:text-white">Contact Us</li>
                            </ul>
                        )}
                    </li>
                    <div className='divider'></div>
                    
                    {/* Admin Menus - Display based on user role */}
                    {user && user.role === 'Admin' && (
                        <>
                            <li onClick={closeSidebarOnLinkClick} className="group relative text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-2 transition-colors duration-200">
                                <Link to='/admin/dashboard' className="flex items-center gap-x-4 w-full">
                                    <FaHome className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li onClick={closeSidebarOnLinkClick} className="group relative text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-2 transition-colors duration-200">
                                <Link to='/admin/managed-products' className="flex items-center gap-x-4 w-full">
                                    <MdOutlineAddShoppingCart className="w-5 h-5" />
                                    <span>Manage Products</span>
                                </Link>
                            </li>
                            <li onClick={closeSidebarOnLinkClick} className="group relative text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-2 transition-colors duration-200">
                                <Link to='/admin/order-request' className="flex items-center gap-x-4 w-full">
                                    <TbShoppingCartBolt className="w-5 h-5" />
                                    <span>Order Request</span>
                                </Link>
                            </li>
                            <li onClick={closeSidebarOnLinkClick} className="group relative text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-2 transition-colors duration-200">
                                <Link to='/admin/accounts' className="flex items-center gap-x-4 w-full">
                                    <FaUsersCog className="w-5 h-5" />
                                    <span>Manage Accounts</span>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* Overlay for small screens */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

export default Sidebar;

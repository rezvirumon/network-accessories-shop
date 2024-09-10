import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../shared/Sidebar'; // Specific sidebar for admin
import AdminNavbar from '../shared/Navbar'; // Specific navbar for admin

const DashboardRoot = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <AdminSidebar />
            <div className="flex-grow flex flex-col">
                <AdminNavbar />
                <div className="flex-grow lg:p-7 p-2 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardRoot;

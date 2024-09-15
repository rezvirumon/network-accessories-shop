import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';

const Root = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-grow flex flex-col">
                <Navbar />
                <div className="flex-grow lg:p-7 p-2 overflow-y-auto bg-white">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Root;

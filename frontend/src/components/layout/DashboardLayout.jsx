import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-100 font-sans relative">
            {/* Subtle animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10 pointer-events-none"></div>

            <Navbar />

            <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full max-w-7xl mx-auto relative z-10">
                {children || <Outlet />}
            </main>
        </div>
    );
};

export default DashboardLayout;

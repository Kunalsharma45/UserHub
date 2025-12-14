import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5';
    };

    const isAdmin = user?.roles?.some(role => role === 'ROLE_ADMIN');
    const isModerator = user?.roles?.some(role => role === 'ROLE_MODERATOR');

    return (
        <nav className="bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-700/50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                        </div>
                        <span className="font-display font-bold text-xl text-white tracking-tight group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                            UserHub
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link
                                to="/dashboard"
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive('/dashboard')}`}
                            >
                                Dashboard
                            </Link>

                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive('/admin')}`}
                                >
                                    Admin Panel
                                </Link>
                            )}

                            <Link
                                to="/profile"
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive('/profile')}`}
                            >
                                Profile
                            </Link>
                        </div>
                    </div>

                    {/* User Menu & Logout */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 gap-4">
                            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-gray-800/80 border border-gray-700/50">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                                <span className="text-sm text-white font-medium">{user?.username}</span>
                            </div>

                            <button
                                onClick={logout}
                                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                                title="Sign out"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-all duration-200"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="block w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/dashboard"
                            className={`block px-3 py-2 rounded-xl text-base font-medium ${isActive('/dashboard')}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>

                        {isAdmin && (
                            <Link
                                to="/admin"
                                className={`block px-3 py-2 rounded-xl text-base font-medium ${isActive('/admin')}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Admin Panel
                            </Link>
                        )}

                        <Link
                            to="/profile"
                            className={`block px-3 py-2 rounded-xl text-base font-medium ${isActive('/profile')}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Profile
                        </Link>
                    </div>

                    <div className="pt-4 pb-4 border-t border-white/10">
                        <div className="flex items-center px-5">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 flex items-center justify-center text-sm font-bold text-white">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium leading-none text-white">{user?.username}</div>
                                <div className="text-sm font-medium leading-none text-gray-400 mt-1">{user?.email}</div>
                            </div>
                            <button
                                onClick={logout}
                                className="ml-auto flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                            >
                                <span className="sr-only">Sign out</span>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

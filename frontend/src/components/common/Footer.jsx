import React from 'react';
import { Shield, Heart } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="mt-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    {/* Brand */}
                    <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            UserHub
                        </span>
                    </div>

                    {/* Copyright */}
                    <div className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} UserHub. All rights reserved.
                    </div>

                    {/* Made with love */}
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                        <span>by UserHub Team</span>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-800 text-center">
                    <p className="text-gray-600 text-xs">
                        Secure User Management System • JWT Authentication • Spring Boot & React
                    </p>
                </div>
            </div>
        </footer>
    );
};

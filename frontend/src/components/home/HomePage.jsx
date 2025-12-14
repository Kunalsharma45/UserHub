import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Users, FileText, Mail, CheckCircle, ArrowRight, Database, Cloud, Zap } from 'lucide-react';

export const HomePage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Shield,
            title: "Secure Authentication",
            description: "JWT-based authentication with role-based access control for maximum security.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: Lock,
            title: "Password Recovery",
            description: "Email-based OTP verification system for secure password reset functionality.",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Users,
            title: "User Management",
            description: "Complete admin dashboard with user approval system and role management.",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: FileText,
            title: "Personal Storage",
            description: "Upload and manage your personal files, notes, and documents securely.",
            color: "from-orange-500 to-red-500"
        },
        {
            icon: Mail,
            title: "Email Integration",
            description: "Automated email notifications for OTP verification and account updates.",
            color: "from-indigo-500 to-purple-500"
        },
        {
            icon: CheckCircle,
            title: "Modern UI/UX",
            description: "Beautiful dark theme with smooth animations and responsive design.",
            color: "from-pink-500 to-rose-500"
        }
    ];

    const techStack = [
        { name: "Spring Boot 3", icon: Database },
        { name: "React 18", icon: Zap },
        { name: "JWT Security", icon: Lock },
        { name: "MySQL", icon: Database },
        { name: "Email API", icon: Mail },
        { name: "Cloud Ready", icon: Cloud }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <Shield className="w-8 h-8 text-blue-500" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                UserHub
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="mb-8 inline-block">
                        <div className="flex items-center justify-center w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/50 animate-pulse">
                            <Shield className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Secure User Management
                        </span>
                        <br />
                        <span className="text-white">Made Simple</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
                        A complete Spring Boot application with JWT authentication, role-based access control,
                        and personal storage features. Built for security and scalability.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/register')}
                            className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50 flex items-center space-x-2"
                        >
                            <span>Create Account</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-all duration-300 border-2 border-gray-700 hover:border-gray-600"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-2">
                                100%
                            </div>
                            <div className="text-gray-400">Secure Authentication</div>
                        </div>
                        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
                                JWT
                            </div>
                            <div className="text-gray-400">Token-Based Security</div>
                        </div>
                        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
                                24/7
                            </div>
                            <div className="text-gray-400">Cloud Ready</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Everything you need for a modern, secure user management system
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl"
                            >
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tech Stack Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Built with Modern Technology
                        </h2>
                        <p className="text-xl text-gray-400">
                            Powered by industry-leading frameworks and tools
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {techStack.map((tech, index) => (
                            <div
                                key={index}
                                className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 flex flex-col items-center justify-center space-y-3 hover:transform hover:scale-105"
                            >
                                <tech.icon className="w-10 h-10 text-blue-400" />
                                <span className="text-gray-300 font-semibold text-center">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Create your account today and experience secure, modern user management
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50 flex items-center space-x-3 mx-auto"
                    >
                        <span>Create Free Account</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Shield className="w-6 h-6 text-blue-500" />
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            UserHub
                        </span>
                    </div>
                    <p className="text-gray-500">
                        © 2024 UserHub. Secure User Management System. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

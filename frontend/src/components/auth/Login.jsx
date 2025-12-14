import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Shield, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(username, password);

            if (result.success) {
                const userRoles = result.data.roles || [];

                if (userRoles.includes('ROLE_ADMIN')) {
                    navigate('/admin');
                } else if (userRoles.includes('ROLE_MODERATOR')) {
                    navigate('/moderator');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(result.error || 'Invalid credentials');
                setLoading(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/50 mb-4 animate-float">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Welcome Back
                        </span>
                    </h1>
                    <p className="text-gray-400">Sign in to access your secure dashboard</p>
                </div>

                {/* Main Card */}
                <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700/50">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6 animate-shake">
                            <div className="flex items-center space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-400 text-sm font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none text-white placeholder-gray-500"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none text-white placeholder-gray-500"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-500 bg-gray-900 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                />
                                <span className="ml-2 text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/50 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline inline-flex items-center space-x-1"
                            >
                                <span>Create one</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </p>
                    </div>

                    {/* Home Link */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="text-gray-400 hover:text-gray-300 text-sm transition-colors inline-flex items-center space-x-1"
                        >
                            <Shield className="w-4 h-4" />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                .delay-700 {
                    animation-delay: 0.7s;
                }
            `}</style>
        </div>
    );
};

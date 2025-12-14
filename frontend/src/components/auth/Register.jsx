import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/auth.api';
import { Shield, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters long!');
            return;
        }

        setLoading(true);

        try {
            // Register with default USER role
            await register(username, email, password, ['user']);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-2xl shadow-green-500/50 mb-4 animate-float">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
                            Create Account
                        </span>
                    </h1>
                    <p className="text-gray-400">Join UserHub and start managing your data securely</p>
                </div>

                {/* Main Card */}
                <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700/50">
                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 mb-6 animate-fade-in">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <p className="text-green-400 text-sm font-medium">{success}</p>
                            </div>
                        </div>
                    )}

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
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none text-white placeholder-gray-500"
                                    placeholder="Choose a username"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none text-white placeholder-gray-500"
                                    placeholder="Enter your email"
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
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none text-white placeholder-gray-500"
                                    placeholder="Create a strong password"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                                <Lock className="w-3 h-3" />
                                <span>Password must be at least 6 characters</span>
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/50 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info */}
                    <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-xs text-center flex items-center justify-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>New users are assigned the USER role by default</span>
                        </p>
                    </div>


                    {/* Login Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-green-400 hover:text-green-300 font-semibold transition-colors hover:underline inline-flex items-center space-x-1"
                            >
                                <span>Sign in</span>
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
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                .delay-700 {
                    animation-delay: 0.7s;
                }
            `}</style>
        </div>
    );
};

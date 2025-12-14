import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axios';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('/auth/forgot-password', { email });
            setSuccess('OTP sent successfully!');
            setTimeout(() => navigate('/verify-otp', { state: { email } }), 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="glass-card w-full max-w-md relative z-10 fade-in border-t border-white/20 shadow-2xl">
                <h2 className="text-2xl font-bold font-display text-white mb-2 text-center">Forgot Password</h2>
                <p className="text-gray-400 text-center mb-6 text-sm">Enter your email to receive a verification code</p>

                {error && <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm">{error}</div>}
                {success && <div className="p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-200 text-sm">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="glass-input"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full btn-primary flex justify-center items-center">
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

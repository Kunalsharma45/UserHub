import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axios';

export const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('/auth/verify-otp', { email, otpCode: otp });
            navigate('/reset-password', { state: { email, otpCode: otp } });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="glass-card w-full max-w-md relative z-10 fade-in border-t border-white/20 shadow-2xl">
                <h2 className="text-2xl font-bold font-display text-white mb-2 text-center">Verify Email</h2>
                <p className="text-gray-400 text-center mb-6 text-sm">Enter the code sent to {email}</p>

                {error && <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        className="glass-input text-center text-letter-spacing-2"
                        placeholder="Enter 6-digit code"
                        required
                    />
                    <button type="submit" disabled={loading} className="w-full btn-primary flex justify-center items-center">
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                </form>
            </div>
        </div>
    );
};

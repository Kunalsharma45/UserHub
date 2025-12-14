import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    if (roles.length > 0) {
        const hasRequiredRole = roles.some((role) =>
            user.roles?.includes(role)
        );

        if (!hasRequiredRole) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
                        <div className="text-red-500 text-6xl mb-4">🚫</div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            );
        }
    }

    return children;
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAllUsers, updateUserRoles, deleteUser, getAdminStats, getPendingUsers, approveUser, rejectUser } from '../../api/admin.service';
import DashboardLayout from '../layout/DashboardLayout';
import { Footer } from '../common/Footer';

export const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [selectedUser, setSelectedUser] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [usersData, statsData, pendingData] = await Promise.all([
                getAllUsers(),
                getAdminStats(),
                getPendingUsers()
            ]);
            setUsers(usersData);
            setStats(statsData);
            setPendingUsers(pendingData);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            await approveUser(userId);
            setSuccess('User approved successfully!');
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to approve user');
        }
    };

    const handleReject = async (userId) => {
        try {
            await rejectUser(userId);
            setSuccess('User rejected and removed!');
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reject user');
        }
    };

    const handleEditRoles = (user) => {
        setSelectedUser(user);
        setSelectedRoles(user.roles || []);
        setShowRoleModal(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleRoleChange = (role) => {
        setSelectedRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };

    const handleUpdateRoles = async () => {
        try {
            await updateUserRoles(selectedUser.id, selectedRoles);
            setSuccess('User roles updated successfully!');
            setShowRoleModal(false);
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update roles');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteUser(selectedUser.id);
            setSuccess('User deleted successfully!');
            setShowDeleteModal(false);
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400 text-lg">Loading admin dashboard...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-400">Manage users, roles, and permissions</p>
                    </div>
                </div>

                {/* Messages */}
                {success && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                        <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-green-200 font-medium">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                        <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-200 font-medium">{error}</p>
                    </div>
                )}

                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-600/50 to-blue-700/50 border border-blue-500/50 rounded-2xl p-6 hover:border-blue-400/70 transition-all duration-300 shadow-xl backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-600/60 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Total Users</p>
                            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-600/50 to-purple-700/50 border border-purple-500/50 rounded-2xl p-6 hover:border-purple-400/70 transition-all duration-300 shadow-xl backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-600/60 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-purple-100" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-purple-100 text-sm font-medium mb-1">Admins</p>
                            <p className="text-3xl font-bold text-white">{stats.adminCount}</p>
                        </div>

                        <div className="bg-gradient-to-br from-pink-600/50 to-pink-700/50 border border-pink-500/50 rounded-2xl p-6 hover:border-pink-400/70 transition-all duration-300 shadow-xl backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-pink-600/60 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-pink-100" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-pink-100 text-sm font-medium mb-1">Moderators</p>
                            <p className="text-3xl font-bold text-white">{stats.moderatorCount}</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-600/50 to-green-700/50 border border-green-500/50 rounded-2xl p-6 hover:border-green-400/70 transition-all duration-300 shadow-xl backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-green-600/60 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-green-100" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-green-100 text-sm font-medium mb-1">Regular Users</p>
                            <p className="text-3xl font-bold text-white">{stats.userCount}</p>
                        </div>
                    </div>
                )}

                {/* Pending Approvals Section */}
                {pendingUsers && pendingUsers.length > 0 && (
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/50 rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-yellow-600/50 to-orange-600/50 border-b border-yellow-500/50 p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-yellow-500/60 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-yellow-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Pending Approvals</h2>
                                    <p className="text-yellow-100 text-sm">{pendingUsers.length} user{pendingUsers.length !== 1 ? 's' : ''} waiting for approval</p>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Requested Roles</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {pendingUsers.map((userData) => (
                                        <tr key={userData.id} className="hover:bg-gray-700/30 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                                        {userData.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-white font-medium">{userData.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                                {userData.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    {userData.roles.map((role, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${role === 'ROLE_ADMIN' ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50' :
                                                                role === 'ROLE_MODERATOR' ? 'bg-pink-500/30 text-pink-200 border border-pink-500/50' :
                                                                    'bg-green-500/30 text-green-200 border border-green-500/50'
                                                                }`}
                                                        >
                                                            {role.replace('ROLE_', '')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => handleApprove(userData.id)}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg inline-flex items-center gap-2 mr-2 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(userData.id)}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg inline-flex items-center gap-2 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-2xl font-bold text-white">User Management</h2>
                        <p className="text-gray-400 text-sm mt-1">Manage user roles and permissions</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Roles</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users.map((userData) => (
                                    <tr key={userData.id} className="hover:bg-gray-700/30 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {userData.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-white font-medium">{userData.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                            {userData.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                {userData.roles.map((role, idx) => (
                                                    <span
                                                        key={idx}
                                                        className={`px-3 py-1 text-xs font-semibold rounded-full ${role === 'ROLE_ADMIN' ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50' :
                                                            role === 'ROLE_MODERATOR' ? 'bg-pink-500/30 text-pink-200 border border-pink-500/50' :
                                                                'bg-green-500/30 text-green-200 border border-green-500/50'
                                                            }`}
                                                    >
                                                        {role.replace('ROLE_', '')}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleEditRoles(userData)}
                                                className="text-blue-400 hover:text-blue-300 mr-4 font-medium transition-colors"
                                            >
                                                Edit Roles
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(userData)}
                                                className="text-red-400 hover:text-red-300 font-medium transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Role Modal */}
                {showRoleModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-2">Edit User Roles</h3>
                            <p className="text-gray-400 mb-6">User: <span className="text-white font-semibold">{selectedUser?.username}</span></p>

                            <div className="space-y-3 mb-6">
                                {['ROLE_USER', 'ROLE_ADMIN'].map((role) => (
                                    <label key={role} className="flex items-center p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700/70 cursor-pointer transition border border-gray-600/30 hover:border-gray-600/50">
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.includes(role)}
                                            onChange={() => handleRoleChange(role)}
                                            className="w-5 h-5 rounded text-blue-600 mr-3"
                                        />
                                        <span className="text-white font-medium">{role.replace('ROLE_', '')}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleUpdateRoles}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setShowRoleModal(false)}
                                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
                            <div className="w-16 h-16 bg-red-500/20 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Delete User</h3>
                            <p className="text-gray-400 mb-2">Are you sure you want to delete:</p>
                            <p className="text-white font-semibold text-lg mb-2">{selectedUser?.username}?</p>
                            <p className="text-red-400 text-sm mb-6">This action cannot be undone!</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleConfirmDelete}
                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all shadow-lg"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </DashboardLayout>
    );
};

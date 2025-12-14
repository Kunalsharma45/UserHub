import axios from './axios';

// Get all users
export const getAllUsers = async () => {
    const response = await axios.get('/admin/users');
    return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
    const response = await axios.get(`/admin/users/${id}`);
    return response.data;
};

// Update user roles
export const updateUserRoles = async (userId, roles) => {
    const response = await axios.put(`/admin/users/${userId}/roles`, { roles });
    return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
    const response = await axios.delete(`/admin/users/${userId}`);
    return response.data;
};

// Get admin statistics
export const getAdminStats = async () => {
    const response = await axios.get('/admin/statistics');
    return response.data;
};

// Get pending users
export const getPendingUsers = async () => {
    const response = await axios.get('/admin/pending-users');
    return response.data;
};

// Approve user
export const approveUser = async (userId) => {
    const response = await axios.post(`/admin/approve-user/${userId}`);
    return response.data;
};

// Reject user
export const rejectUser = async (userId) => {
    const response = await axios.delete(`/admin/reject-user/${userId}`);
    return response.data;
};

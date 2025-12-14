import axios from './axios';

// Login
export const login = async (username, password) => {
    const response = await axios.post('/auth/signin', {
        username,
        password,
    });

    if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// Register
export const register = async (username, email, password, roles = ['user']) => {
    const response = await axios.post('/auth/signup', {
        username,
        email,
        password,
        role: roles,
    });
    return response.data;
};

// Logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

// Get user roles
export const getUserRoles = () => {
    const user = getCurrentUser();
    return user?.roles || [];
};

// Check if user has role
export const hasRole = (role) => {
    const roles = getUserRoles();
    return roles.includes(role);
};

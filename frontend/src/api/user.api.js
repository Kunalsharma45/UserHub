import axios from './axios';

// Get public content
export const getPublicContent = async () => {
    const response = await axios.get('/test/all');
    return response.data;
};

// Get user content
export const getUserContent = async () => {
    const response = await axios.get('/test/user');
    return response.data;
};

// Get moderator content
export const getModeratorContent = async () => {
    const response = await axios.get('/test/mod');
    return response.data;
};

// Get admin content
export const getAdminContent = async () => {
    const response = await axios.get('/test/admin');
    return response.data;
};

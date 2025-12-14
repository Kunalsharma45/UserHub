import axios from './axios';

// Get user profile
export const getUserProfile = async () => {
    const response = await axios.get('/user/profile');
    return response.data;
};

// Update user profile
export const updateProfile = async (username, email) => {
    const response = await axios.put('/user/profile', { username, email });
    return response.data;
};

// Change password
export const changePassword = async (oldPassword, newPassword) => {
    const response = await axios.post('/user/change-password', {
        oldPassword,
        newPassword
    });
    return response.data;
};

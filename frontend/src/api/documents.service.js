import axios from './axios';

// Get all user documents
export const getUserDocuments = async () => {
    const response = await axios.get('/user/documents');
    return response.data;
};

// Create a new note
export const createNote = async (title, content) => {
    const response = await axios.post('/user/documents/note', {
        title,
        content,
        documentType: 'NOTE'
    });
    return response.data;
};

// Upload a file or image
export const uploadFile = async (file, title) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    const response = await axios.post('/user/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Update a document
export const updateDocument = async (id, title, content) => {
    const response = await axios.put(`/user/documents/${id}`, {
        title,
        content,
        documentType: 'NOTE'
    });
    return response.data;
};

// Delete a document
export const deleteDocument = async (id) => {
    const response = await axios.delete(`/user/documents/${id}`);
    return response.data;
};

// Get document count
export const getDocumentCount = async () => {
    const response = await axios.get('/user/documents/count');
    return response.data;
};

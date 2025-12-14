import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserDocuments, createNote, uploadFile, deleteDocument, updateDocument } from '../../api/documents.service';
import DashboardLayout from '../layout/DashboardLayout';
import { Footer } from '../common/Footer';

export const UserDashboard = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewDocument, setPreviewDocument] = useState(null);
    const [editingNote, setEditingNote] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [noteForm, setNoteForm] = useState({ title: '', content: '' });
    const [uploadForm, setUploadForm] = useState({ title: '', file: null });

    const navigate = useNavigate();

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const data = await getUserDocuments();
            setDocuments(data);
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();
        try {
            if (editingNote) {
                await updateDocument(editingNote.id, noteForm.title, noteForm.content);
                setMessage({ type: 'success', text: 'Note updated successfully!' });
            } else {
                await createNote(noteForm.title, noteForm.content);
                setMessage({ type: 'success', text: 'Note created successfully!' });
            }
            setNoteForm({ title: '', content: '' });
            setShowNoteModal(false);
            setEditingNote(null);
            loadDocuments();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save note' });
        }
    };

    const handleUploadFile = async (e) => {
        e.preventDefault();
        try {
            await uploadFile(uploadForm.file, uploadForm.title);
            setMessage({ type: 'success', text: 'File uploaded successfully!' });
            setUploadForm({ title: '', file: null });
            setShowUploadModal(false);
            loadDocuments();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload file' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteDocument(id);
                setMessage({ type: 'success', text: 'Item deleted successfully!' });
                loadDocuments();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to delete item' });
            }
        }
    };

    const handleEditNote = (note) => {
        setEditingNote(note);
        setNoteForm({ title: note.title, content: note.content });
        setShowNoteModal(true);
    };

    const handlePreview = (doc) => {
        setPreviewDocument(doc);
        setShowPreviewModal(true);
    };

    const filteredDocuments = documents.filter(doc => {
        if (activeTab === 'all') return true;
        if (activeTab === 'notes') return doc.documentType === 'NOTE';
        if (activeTab === 'files') return doc.documentType === 'FILE';
        if (activeTab === 'images') return doc.documentType === 'IMAGE';
        return true;
    });

    const stats = {
        total: documents.length,
        notes: documents.filter(d => d.documentType === 'NOTE').length,
        files: documents.filter(d => d.documentType === 'FILE').length,
        images: documents.filter(d => d.documentType === 'IMAGE').length,
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400 text-lg">Loading your dashboard...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-600/60 to-purple-600/60 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-purple-500/30">
                            {user?.username?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">
                                Welcome back, {user?.username}! 👋
                            </h1>
                            <p className="text-blue-100">Manage your account and personal storage from here.</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {message.text && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${message.type === 'success'
                        ? 'bg-green-500/20 text-green-100 border border-green-500/50'
                        : 'bg-red-500/20 text-red-100 border border-red-500/50'
                        }`}>
                        <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            {message.type === 'success' ? (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            ) : (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            )}
                        </svg>
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-600/50 to-blue-700/50 border border-blue-500/50 rounded-2xl p-6 hover:border-blue-400/70 transition-all duration-300 shadow-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/60 flex items-center justify-center">
                                <svg className="w-7 h-7 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-blue-100 text-sm font-medium mb-1">Total Items</p>
                        <p className="text-3xl font-bold text-white">{stats.total}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-600/50 to-green-700/50 border border-green-500/50 rounded-2xl p-6 hover:border-green-400/70 transition-all duration-300 shadow-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-green-600/60 flex items-center justify-center">
                                <svg className="w-7 h-7 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-green-100 text-sm font-medium mb-1">Notes</p>
                        <p className="text-3xl font-bold text-white">{stats.notes}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600/50 to-purple-700/50 border border-purple-500/50 rounded-2xl p-6 hover:border-purple-400/70 transition-all duration-300 shadow-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-600/60 flex items-center justify-center">
                                <svg className="w-7 h-7 text-purple-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-purple-100 text-sm font-medium mb-1">Images</p>
                        <p className="text-3xl font-bold text-white">{stats.images}</p>
                    </div>

                    <div className="bg-gradient-to-br from-pink-600/50 to-pink-700/50 border border-pink-500/50 rounded-2xl p-6 hover:border-pink-400/70 transition-all duration-300 shadow-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-pink-600/60 flex items-center justify-center">
                                <svg className="w-7 h-7 text-pink-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-pink-100 text-sm font-medium mb-1">Files</p>
                        <p className="text-3xl font-bold text-white">{stats.files}</p>
                    </div>
                </div>

                {/* Personal Storage Section */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header with Actions */}
                    <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Personal Storage</h2>
                            <p className="text-gray-400 text-sm mt-1">Store your notes, files, and images securely</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setEditingNote(null);
                                    setNoteForm({ title: '', content: '' });
                                    setShowNoteModal(true);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-all shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Note
                            </button>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-all shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Upload
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-700 px-6">
                        {[
                            { id: 'all', label: 'All', count: stats.total },
                            { id: 'notes', label: 'Notes', count: stats.notes },
                            { id: 'images', label: 'Images', count: stats.images },
                            { id: 'files', label: 'Files', count: stats.files }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 font-semibold transition-all relative ${activeTab === tab.id
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>

                    {/* Documents Grid */}
                    <div className="p-6">
                        {filteredDocuments.length === 0 ? (
                            <div className="text-center py-16">
                                <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-400 mb-2">No items yet</h3>
                                <p className="text-gray-500 mb-6">Create a note or upload a file to get started!</p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => setShowNoteModal(true)}
                                        className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all"
                                    >
                                        Create Note
                                    </button>
                                    <button
                                        onClick={() => setShowUploadModal(true)}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all"
                                    >
                                        Upload File
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredDocuments.map(doc => (
                                    <div
                                        key={doc.id}
                                        className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-4 hover:bg-gray-700/40 hover:border-gray-600/70 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.documentType === 'NOTE' ? 'bg-green-600/30' :
                                                    doc.documentType === 'IMAGE' ? 'bg-purple-600/30' :
                                                        'bg-blue-600/30'
                                                    }`}>
                                                    {doc.documentType === 'NOTE' ? (
                                                        <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    ) : doc.documentType === 'IMAGE' ? (
                                                        <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${doc.documentType === 'NOTE' ? 'bg-green-500/20 text-green-200' :
                                                        doc.documentType === 'IMAGE' ? 'bg-purple-500/20 text-purple-200' :
                                                            'bg-blue-500/20 text-blue-200'
                                                        }`}>
                                                        {doc.documentType}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handlePreview(doc)}
                                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                                    title="Preview"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                {doc.documentType === 'NOTE' && (
                                                    <button
                                                        onClick={() => handleEditNote(doc)}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-white font-semibold mb-2 truncate">{doc.title}</h3>
                                        {doc.documentType === 'NOTE' && doc.content && (
                                            <p className="text-gray-400 text-sm line-clamp-3">{doc.content}</p>
                                        )}
                                        {doc.fileName && (
                                            <p className="text-gray-400 text-xs mt-2 truncate">📎 {doc.fileName}</p>
                                        )}
                                        <div className="mt-3 pt-3 border-t border-gray-600/30 flex items-center justify-between text-xs text-gray-500">
                                            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                            {doc.fileSize && (
                                                <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all shadow-xl cursor-pointer" onClick={() => navigate('/profile')}>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-blue-600/30 flex items-center justify-center">
                                <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Account Settings</h3>
                                <p className="text-gray-400 text-sm">Manage your profile and preferences</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all shadow-xl cursor-pointer" onClick={() => navigate('/profile')}>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-purple-600/30 flex items-center justify-center">
                                <svg className="w-7 h-7 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Security</h3>
                                <p className="text-gray-400 text-sm">Update password and security settings</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create/Edit Note Modal */}
                {showNoteModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-6">
                                {editingNote ? 'Edit Note' : 'Create New Note'}
                            </h3>
                            <form onSubmit={handleCreateNote} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-200 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={noteForm.title}
                                        onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Enter note title..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-200 mb-2">Content</label>
                                    <textarea
                                        value={noteForm.content}
                                        onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
                                        placeholder="Write your note here..."
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-xl transition-all shadow-lg"
                                    >
                                        {editingNote ? 'Update Note' : 'Create Note'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowNoteModal(false);
                                            setEditingNote(null);
                                            setNoteForm({ title: '', content: '' });
                                        }}
                                        className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-6">Upload File or Image</h3>
                            <form onSubmit={handleUploadFile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-200 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={uploadForm.title}
                                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter title..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-200 mb-2">File</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg"
                                    >
                                        Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowUploadModal(false);
                                            setUploadForm({ title: '', file: null });
                                        }}
                                        className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Preview Modal */}
                {showPreviewModal && previewDocument && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${previewDocument.documentType === 'NOTE' ? 'bg-green-600/30' :
                                        previewDocument.documentType === 'IMAGE' ? 'bg-purple-600/30' :
                                            'bg-blue-600/30'
                                        }`}>
                                        {previewDocument.documentType === 'NOTE' ? (
                                            <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        ) : previewDocument.documentType === 'IMAGE' ? (
                                            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">{previewDocument.title}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${previewDocument.documentType === 'NOTE' ? 'bg-green-500/20 text-green-200' :
                                            previewDocument.documentType === 'IMAGE' ? 'bg-purple-500/20 text-purple-200' :
                                                'bg-blue-500/20 text-blue-200'
                                            }`}>
                                            {previewDocument.documentType}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowPreviewModal(false);
                                        setPreviewDocument(null);
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content based on type */}
                            <div className="space-y-4">
                                {/* Note Preview */}
                                {previewDocument.documentType === 'NOTE' && (
                                    <div className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-6">
                                        <h4 className="text-sm font-semibold text-gray-400 mb-3">Content</h4>
                                        <p className="text-white whitespace-pre-wrap">{previewDocument.content}</p>
                                    </div>
                                )}

                                {/* Image Preview */}
                                {previewDocument.documentType === 'IMAGE' && (
                                    <div className="space-y-4">
                                        <div className="bg-gray-900/50 rounded-xl p-4 flex items-center justify-center min-h-[300px]">
                                            <img
                                                src={`http://localhost:8080/api/user/documents/files/${previewDocument.filePath}`}
                                                alt={previewDocument.title}
                                                className="max-h-[500px] max-w-full object-contain rounded-lg"
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23374151" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="%239CA3AF" dy=".3em">Image not found</text></svg>';
                                                }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-700/30 rounded-lg p-3">
                                                <p className="text-gray-400 text-xs mb-1">File Name</p>
                                                <p className="text-white text-sm font-medium truncate">{previewDocument.fileName}</p>
                                            </div>
                                            <div className="bg-gray-700/30 rounded-lg p-3">
                                                <p className="text-gray-400 text-xs mb-1">File Size</p>
                                                <p className="text-white text-sm font-medium">{(previewDocument.fileSize / 1024).toFixed(2)} KB</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* File Preview */}
                                {previewDocument.documentType === 'FILE' && (
                                    <div className="space-y-4">
                                        <div className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-8 text-center">
                                            <div className="w-24 h-24 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h4 className="text-lg font-semibold text-white mb-2">{previewDocument.fileName}</h4>
                                            <p className="text-gray-400 text-sm mb-4">{previewDocument.mimeType || 'Unknown type'}</p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-gray-700/30 rounded-lg p-3">
                                                <p className="text-gray-400 text-xs mb-1">Size</p>
                                                <p className="text-white text-sm font-medium">{(previewDocument.fileSize / 1024).toFixed(2)} KB</p>
                                            </div>
                                            <div className="bg-gray-700/30 rounded-lg p-3">
                                                <p className="text-gray-400 text-xs mb-1">Created</p>
                                                <p className="text-white text-sm font-medium">{new Date(previewDocument.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="bg-gray-700/30 rounded-lg p-3">
                                                <p className="text-gray-400 text-xs mb-1">Updated</p>
                                                <p className="text-white text-sm font-medium">{new Date(previewDocument.updatedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4 border-t border-gray-700">
                                    {previewDocument.documentType === 'NOTE' && (
                                        <button
                                            onClick={() => {
                                                handleEditNote(previewDocument);
                                                setShowPreviewModal(false);
                                            }}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit Note
                                        </button>
                                    )}
                                    {(previewDocument.documentType === 'FILE' || previewDocument.documentType === 'IMAGE') && (
                                        <a
                                            href={`http://localhost:8080/api/user/documents/files/${previewDocument.filePath}`}
                                            download={previewDocument.fileName}
                                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download
                                        </a>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleDelete(previewDocument.id);
                                            setShowPreviewModal(false);
                                        }}
                                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowPreviewModal(false);
                                            setPreviewDocument(null);
                                        }}
                                        className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </DashboardLayout>
    );
};

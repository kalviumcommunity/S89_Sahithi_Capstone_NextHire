import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!content.trim()) {
            alert('Please enter some content for your post');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/posts/create', {
                content: content.trim(),
                image: image.trim()
            });

            // Reset form
            setContent('');
            setImage('');
            setShowForm(false);

            // Notify parent component
            if (onPostCreated) {
                onPostCreated(response.data.post);
            }

            alert('Post created successfully!');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error creating post: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setContent('');
        setImage('');
        setShowForm(false);
    };

    if (!showForm) {
        return (
            <div className="create-post-trigger">
                <div className="post-trigger-card">
                    <div className="trigger-avatar">
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt={user.fullName} />
                        ) : (
                            <div className="avatar-placeholder-trigger">
                                {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <button 
                        className="trigger-input"
                        onClick={() => setShowForm(true)}
                    >
                        What's on your mind, {user?.fullName?.split(' ')[0] || user?.username}?
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="create-post-form">
            <div className="form-header">
                <h3>Create Post</h3>
                <button className="close-btn" onClick={handleCancel}>×</button>
            </div>
            
            <div className="form-body">
                <div className="author-info">
                    <div className="author-avatar">
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt={user.fullName} />
                        ) : (
                            <div className="avatar-placeholder-form">
                                {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="author-details">
                        <h4>{user?.fullName || user?.username}</h4>
                        <span>@{user?.username}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's happening?"
                            rows="4"
                            maxLength="2000"
                            required
                        />
                        <div className="char-count">
                            {content.length}/2000
                        </div>
                    </div>

                    <div className="form-group">
                        <input
                            type="url"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="Add an image URL (optional)"
                        />
                    </div>

                    {image && (
                        <div className="image-preview">
                            <img src={image} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                    )}

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="post-btn"
                            disabled={loading || !content.trim()}
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;

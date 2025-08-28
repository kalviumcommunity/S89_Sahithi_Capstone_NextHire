import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './PostCard.css';

const PostCard = ({ post, onUpdate, onDelete }) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [likingPost, setLikingPost] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [editImage, setEditImage] = useState(post.image || '');
    const [savingEdit, setSavingEdit] = useState(false);
    const { user } = useAuth();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    };

    const handleLike = async () => {
        if (likingPost) return;
        
        setLikingPost(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/like`);
            
            const updatedPost = {
                ...post,
                isLiked: response.data.isLiked,
                likeCount: response.data.likeCount
            };
            
            onUpdate(updatedPost);
        } catch (error) {
            console.error('Error liking post:', error);
        } finally {
            setLikingPost(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || submittingComment) return;

        setSubmittingComment(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/comment`, {
                content: newComment.trim()
            });

            const updatedPost = {
                ...post,
                comments: [...post.comments, response.data.comment],
                commentCount: response.data.commentCount
            };

            onUpdate(updatedPost);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Error adding comment: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`http://localhost:5000/api/posts/${post._id}`);
                onDelete(post._id);
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Error deleting post: ' + (error.response?.data?.message || 'Unknown error'));
            }
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditContent(post.content);
        setEditImage(post.image || '');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditContent(post.content);
        setEditImage(post.image || '');
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim()) {
            alert('Post content cannot be empty');
            return;
        }

        setSavingEdit(true);
        try {
            const response = await axios.put(`http://localhost:5000/api/posts/${post._id}`, {
                content: editContent.trim(),
                image: editImage.trim()
            });

            const updatedPost = {
                ...post,
                content: response.data.post.content,
                image: response.data.post.image,
                updatedAt: response.data.post.updatedAt
            };

            onUpdate(updatedPost);
            setIsEditing(false);
        } catch (error) {
            console.error('Error editing post:', error);
            alert('Error editing post: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setSavingEdit(false);
        }
    };

    const isOwnPost = post.author._id === user._id;

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="author-info">
                    <div className="author-avatar">
                        {post.author.profilePicture ? (
                            <img src={post.author.profilePicture} alt={post.author.fullName} />
                        ) : (
                            <div className="avatar-placeholder">
                                {post.author.fullName?.charAt(0) || post.author.username?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="author-details">
                        <h4>{post.author.fullName || post.author.username}</h4>
                        <span>
                            @{post.author.username} • {formatDate(post.createdAt)}
                            {post.updatedAt && post.updatedAt !== post.createdAt && (
                                <span className="edited-indicator"> • edited</span>
                            )}
                        </span>
                    </div>
                </div>
                {isOwnPost && (
                    <div className="post-actions-menu">
                        <button className="edit-btn" onClick={handleEdit} title="Edit post">
                            ✏️
                        </button>
                        <button className="delete-btn" onClick={handleDelete} title="Delete post">
                            🗑️
                        </button>
                    </div>
                )}
            </div>

            <div className="post-content">
                {isEditing ? (
                    <div className="edit-form">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="What's happening?"
                            rows="4"
                            maxLength="2000"
                            className="edit-textarea"
                        />
                        <div className="char-count">
                            {editContent.length}/2000
                        </div>

                        <input
                            type="url"
                            value={editImage}
                            onChange={(e) => setEditImage(e.target.value)}
                            placeholder="Image URL (optional)"
                            className="edit-image-input"
                        />

                        {editImage && (
                            <div className="edit-image-preview">
                                <img src={editImage} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                            </div>
                        )}

                        <div className="edit-actions">
                            <button
                                className="cancel-edit-btn"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>
                            <button
                                className="save-edit-btn"
                                onClick={handleSaveEdit}
                                disabled={savingEdit || !editContent.trim()}
                            >
                                {savingEdit ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p>{post.content}</p>
                        {post.image && (
                            <div className="post-image">
                                <img src={post.image} alt="Post content" />
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="post-actions">
                <button 
                    className={`action-btn like-btn ${post.isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                    disabled={likingPost}
                >
                    <span className="action-icon">{post.isLiked ? '❤️' : '🤍'}</span>
                    <span className="action-count">{post.likeCount || 0}</span>
                </button>

                <button 
                    className="action-btn comment-btn"
                    onClick={() => setShowComments(!showComments)}
                >
                    <span className="action-icon">💬</span>
                    <span className="action-count">{post.commentCount || 0}</span>
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    <form onSubmit={handleComment} className="comment-form">
                        <div className="comment-input-container">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                maxLength="500"
                            />
                            <button 
                                type="submit" 
                                disabled={!newComment.trim() || submittingComment}
                                className="comment-submit-btn"
                            >
                                {submittingComment ? '...' : 'Post'}
                            </button>
                        </div>
                    </form>

                    <div className="comments-list">
                        {post.comments?.map((comment, index) => (
                            <div key={index} className="comment">
                                <div className="comment-avatar">
                                    {comment.user.profilePicture ? (
                                        <img src={comment.user.profilePicture} alt={comment.user.fullName} />
                                    ) : (
                                        <div className="avatar-placeholder-small">
                                            {comment.user.fullName?.charAt(0) || comment.user.username?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="comment-content">
                                    <div className="comment-header">
                                        <span className="comment-author">
                                            {comment.user.fullName || comment.user.username}
                                        </span>
                                        <span className="comment-time">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="comment-text">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;

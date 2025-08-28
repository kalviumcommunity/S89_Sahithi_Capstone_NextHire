import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import './PostFeed.css';

const PostFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const { user } = useAuth();

    const fetchPosts = async (pageNum = 1, reset = false) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const response = await axios.get(`http://localhost:5000/api/posts/feed?page=${pageNum}&limit=10`);
            
            if (reset || pageNum === 1) {
                setPosts(response.data.posts);
            } else {
                setPosts(prev => [...prev, ...response.data.posts]);
            }
            
            setHasMore(response.data.pagination.hasMore);
            setPage(pageNum);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPosts(1, true);
        }
    }, [user]);

    const handlePostCreated = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };

    const handlePostUpdate = (updatedPost) => {
        setPosts(prev => prev.map(post => 
            post._id === updatedPost._id ? updatedPost : post
        ));
    };

    const handlePostDelete = (deletedPostId) => {
        setPosts(prev => prev.filter(post => post._id !== deletedPostId));
    };

    const loadMorePosts = () => {
        if (hasMore && !loadingMore) {
            fetchPosts(page + 1);
        }
    };

    if (loading) {
        return (
            <div className="post-feed">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="post-feed">
            <CreatePost onPostCreated={handlePostCreated} />
            
            {posts.length === 0 ? (
                <div className="empty-feed">
                    <div className="empty-icon">📝</div>
                    <h3>Your feed is empty</h3>
                    <p>Start following people or create your first post to see content here!</p>
                </div>
            ) : (
                <div className="posts-container">
                    {posts.map(post => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onUpdate={handlePostUpdate}
                            onDelete={handlePostDelete}
                        />
                    ))}
                    
                    {hasMore && (
                        <div className="load-more-container">
                            <button 
                                className="load-more-btn"
                                onClick={loadMorePosts}
                                disabled={loadingMore}
                            >
                                {loadingMore ? 'Loading...' : 'Load More Posts'}
                            </button>
                        </div>
                    )}
                    
                    {!hasMore && posts.length > 0 && (
                        <div className="end-of-feed">
                            <p>You've reached the end of your feed!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostFeed;

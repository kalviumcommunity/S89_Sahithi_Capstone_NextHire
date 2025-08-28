import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './UserSearch.css';

const UserSearch = ({ onFollowChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { user, updateUser } = useAuth();

    // Fetch suggested users on component mount
    useEffect(() => {
        fetchSuggestions();
    }, []);

    // Search users with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim().length >= 2) {
                searchUsers();
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const fetchSuggestions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/suggestions?limit=10');
            setSuggestions(response.data.suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const searchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/users/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchResults(response.data.users);
        } catch (error) {
            console.error('Error searching users:', error);
            setMessage('Error searching users');
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId, isFollowing) => {
        try {
            const endpoint = isFollowing ? 'unfollow' : 'follow';
            const response = await axios.post(`http://localhost:5000/api/users/${endpoint}/${userId}`);

            setMessage(response.data.message);

            // Update the user's follow status in both search results and suggestions
            const updateUserStatus = (users) =>
                users.map(u =>
                    u._id === userId
                        ? { ...u, isFollowing: !isFollowing }
                        : u
                );

            setSearchResults(updateUserStatus);
            setSuggestions(updateUserStatus);

            // Update current user data with the response from server
            if (response.data.user) {
                updateUser(response.data.user);
            }

            // Notify parent component about the follow change
            if (onFollowChange) {
                onFollowChange();
            }

            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating follow status');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const UserCard = ({ user: targetUser, showFollowButton = true }) => (
        <div className="user-card">
            <div className="user-avatar">
                {targetUser.profilePicture ? (
                    <img src={targetUser.profilePicture} alt={targetUser.fullName} />
                ) : (
                    <div className="avatar-placeholder">
                        {targetUser.fullName?.charAt(0) || targetUser.username?.charAt(0)}
                    </div>
                )}
            </div>
            <div className="user-info">
                <h4>{targetUser.fullName || targetUser.username}</h4>
                <p className="username">@{targetUser.username}</p>
                {targetUser.bio && <p className="bio">{targetUser.bio}</p>}
                <div className="user-stats">
                    <span>{targetUser.followerCount || 0} followers</span>
                    <span>{targetUser.followingCount || 0} following</span>
                </div>
            </div>
            {showFollowButton && (
                <div className="user-actions">
                    <button
                        className={`follow-btn ${targetUser.isFollowing ? 'following' : 'follow'}`}
                        onClick={() => handleFollow(targetUser._id, targetUser.isFollowing)}
                    >
                        {targetUser.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="user-search">
            <div className="search-header">
                <h2>Discover People</h2>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search users by name, username, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {loading && <div className="search-loading">Searching...</div>}
                </div>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            {searchQuery.trim().length >= 2 ? (
                <div className="search-results">
                    <h3>Search Results</h3>
                    {searchResults.length > 0 ? (
                        <div className="users-list">
                            {searchResults.map(targetUser => (
                                <UserCard key={targetUser._id} user={targetUser} />
                            ))}
                        </div>
                    ) : !loading ? (
                        <p className="no-results">No users found matching your search.</p>
                    ) : null}
                </div>
            ) : (
                <div className="suggestions">
                    <h3>Suggested for You</h3>
                    {suggestions.length > 0 ? (
                        <div className="users-list">
                            {suggestions.map(targetUser => (
                                <UserCard key={targetUser._id} user={targetUser} />
                            ))}
                        </div>
                    ) : (
                        <p className="no-suggestions">No suggestions available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserSearch;

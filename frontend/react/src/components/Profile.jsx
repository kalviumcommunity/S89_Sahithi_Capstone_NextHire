import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import UserSearch from './UserSearch';
import './Profile.css';

const Profile = () => {
    const { user, logout, updateUser, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('discover');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        fullName: '',
        bio: '',
        profilePicture: ''
    });
    const [stats, setStats] = useState({
        followersCount: 0,
        followingCount: 0
    });

    useEffect(() => {
        if (user) {
            setStats({
                followersCount: user.followerCount || 0,
                followingCount: user.followingCount || 0
            });
            setEditForm({
                fullName: user.fullName || '',
                bio: user.bio || '',
                profilePicture: user.profilePicture || ''
            });
            fetchUserProfile();
        }
    }, [user]);

    // Update stats when user data changes (for real-time updates)
    useEffect(() => {
        if (user) {
            setStats({
                followersCount: user.followerCount || 0,
                followingCount: user.followingCount || 0
            });
        }
    }, [user.followerCount, user.followingCount]);

    // Refresh user data when component mounts to ensure latest data
    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            // Use refreshUser to get the latest data from server
            const userData = await refreshUser();
            if (userData) {
                setStats({
                    followersCount: userData.followerCount || 0,
                    followingCount: userData.followingCount || 0
                });
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchFollowers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/users/followers');
            setFollowers(response.data.followers);
        } catch (error) {
            console.error('Error fetching followers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFollowing = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/users/following');
            setFollowing(response.data.following);
        } catch (error) {
            console.error('Error fetching following:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'followers' && followers.length === 0) {
            fetchFollowers();
        } else if (tab === 'following' && following.length === 0) {
            fetchFollowing();
        }
    };

    const handleFollowChange = () => {
        // Refresh user profile data when follow status changes
        fetchUserProfile();
        // Clear followers and following lists to force refresh
        setFollowers([]);
        setFollowing([]);
    };

    const handleLogout = async () => {
        await logout();
    };

    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        // Reset form to current user data
        setEditForm({
            fullName: user.fullName || '',
            bio: user.bio || '',
            profilePicture: user.profilePicture || ''
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.put('http://localhost:5000/api/users/profile', editForm);

            // Update user context with new data
            updateUser(response.data.user);

            setShowEditModal(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const UserCard = ({ user: targetUser, showFollowButton = true }) => (
        <div className="profile-user-card">
            <div className="profile-user-avatar">
                {targetUser.profilePicture ? (
                    <img src={targetUser.profilePicture} alt={targetUser.fullName} />
                ) : (
                    <div className="profile-avatar-placeholder">
                        {targetUser.fullName?.charAt(0) || targetUser.username?.charAt(0)}
                    </div>
                )}
            </div>
            <div className="profile-user-info">
                <h4>{targetUser.fullName || targetUser.username}</h4>
                <p className="profile-username">@{targetUser.username}</p>
                {targetUser.bio && <p className="profile-bio-text">{targetUser.bio}</p>}
            </div>
            {showFollowButton && (
                <div className="profile-user-actions">
                    <button className="profile-follow-btn">
                        {targetUser.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                </div>
            )}
        </div>
    );

    if (!user) {
        return <div className="profile-loading">Loading...</div>;
    }

    return (
        <div className="profile-container">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-info">
                    <div className="profile-avatar-large">
                        {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.fullName} />
                        ) : (
                            <div className="avatar-placeholder-large">
                                {user.fullName?.charAt(0) || user.username?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="profile-details">
                        <div className="profile-username">
                            <h1>{user.username}</h1>
                            <button className="edit-profile-btn" onClick={handleEditProfile}>Edit Profile</button>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </div>
                        <div className="profile-stats">
                            <div className="stat">
                                <span className="stat-number">0</span>
                                <span className="stat-label">posts</span>
                            </div>
                            <div
                                className="stat clickable"
                                onClick={() => handleTabChange('followers')}
                            >
                                <span className="stat-number">{stats.followersCount}</span>
                                <span className="stat-label">followers</span>
                            </div>
                            <div
                                className="stat clickable"
                                onClick={() => handleTabChange('following')}
                            >
                                <span className="stat-number">{stats.followingCount}</span>
                                <span className="stat-label">following</span>
                            </div>
                        </div>
                        <div className="profile-bio">
                            <h2>{user.fullName}</h2>
                            {user.bio && <p>{user.bio}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Navigation */}
            <div className="profile-nav">
                <button
                    className={`nav-tab ${activeTab === 'discover' ? 'active' : ''}`}
                    onClick={() => handleTabChange('discover')}
                >
                    <span className="nav-icon">🔍</span>
                    DISCOVER
                </button>
                <button
                    className={`nav-tab ${activeTab === 'followers' ? 'active' : ''}`}
                    onClick={() => handleTabChange('followers')}
                >
                    <span className="nav-icon">👥</span>
                    FOLLOWERS
                </button>
                <button
                    className={`nav-tab ${activeTab === 'following' ? 'active' : ''}`}
                    onClick={() => handleTabChange('following')}
                >
                    <span className="nav-icon">➕</span>
                    FOLLOWING
                </button>
            </div>

            {/* Profile Content */}
            <div className="profile-content">
                {activeTab === 'discover' && (
                    <div className="discover-section">
                        <UserSearch onFollowChange={handleFollowChange} />
                    </div>
                )}
                
                {activeTab === 'followers' && (
                    <div className="followers-section">
                        <h3>Followers</h3>
                        {loading ? (
                            <div className="loading-state">Loading followers...</div>
                        ) : stats.followersCount === 0 ? (
                            <div className="empty-state">
                                <p>No followers yet</p>
                                <span>When people follow you, you'll see them here.</span>
                            </div>
                        ) : (
                            <div className="users-grid">
                                {followers.map(follower => (
                                    <UserCard key={follower._id} user={follower} showFollowButton={false} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'following' && (
                    <div className="following-section">
                        <h3>Following</h3>
                        {loading ? (
                            <div className="loading-state">Loading following...</div>
                        ) : stats.followingCount === 0 ? (
                            <div className="empty-state">
                                <p>Not following anyone yet</p>
                                <span>When you follow people, you'll see them here.</span>
                            </div>
                        ) : (
                            <div className="users-grid">
                                {following.map(followingUser => (
                                    <UserCard key={followingUser._id} user={followingUser} showFollowButton={true} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit Profile</h2>
                            <button className="close-btn" onClick={handleCloseModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={editForm.fullName}
                                    onChange={handleFormChange}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={editForm.bio}
                                    onChange={handleFormChange}
                                    placeholder="Tell us about yourself..."
                                    rows="4"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="profilePicture">Profile Picture URL</label>
                                <input
                                    type="url"
                                    id="profilePicture"
                                    name="profilePicture"
                                    value={editForm.profilePicture}
                                    onChange={handleFormChange}
                                    placeholder="https://example.com/your-photo.jpg"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                            <button
                                className="save-btn"
                                onClick={handleSaveProfile}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;

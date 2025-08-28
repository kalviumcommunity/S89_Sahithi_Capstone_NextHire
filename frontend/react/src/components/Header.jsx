import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();

    // Don't show header on login/signup/home pages
    const hideHeaderPaths = ['/', '/login', '/signup'];
    if (hideHeaderPaths.includes(location.pathname)) {
        return null;
    }

    if (!isAuthenticated) {
        return null;
    }

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLogoClick = () => {
        navigate('/dashboard');
    };

    const handleChatClick = () => {
        navigate('/chat');
    };

    return (
        <header className="app-header">
            <div className="header-container">
                {/* Logo */}
                <div className="header-logo" onClick={handleLogoClick}>
                    <h2>NextHire</h2>
                </div>

                {/* Navigation */}
                <nav className="header-nav">
                    <button 
                        className={`nav-button ${location.pathname === '/dashboard' ? 'active' : ''}`}
                        onClick={() => navigate('/dashboard')}
                    >
                        <span className="nav-icon">🏠</span>
                        <span className="nav-label">Home</span>
                    </button>
                    
                    <button 
                        className={`nav-button ${location.pathname === '/chat' ? 'active' : ''}`}
                        onClick={handleChatClick}
                    >
                        <span className="nav-icon">💬</span>
                        <span className="nav-label">Messages</span>
                    </button>
                    
                    <button 
                        className={`nav-button ${location.pathname === '/profile' ? 'active' : ''}`}
                        onClick={handleProfileClick}
                    >
                        <span className="nav-icon">👤</span>
                        <span className="nav-label">Profile</span>
                    </button>
                </nav>

                {/* Profile Section */}
                <div className="header-profile">
                    <div className="profile-info-header">
                        <span className="username">@{user?.username}</span>
                    </div>
                    <div className="profile-avatar-header" onClick={handleProfileClick}>
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt={user.fullName} />
                        ) : (
                            <div className="avatar-placeholder-header">
                                {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
                            </div>
                        )}
                        <div className="online-indicator-header"></div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

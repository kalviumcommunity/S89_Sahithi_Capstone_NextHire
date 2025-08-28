import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import './Chat.css';

const Chat = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showChatArea, setShowChatArea] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();
    const { socket, sendMessage, startTyping, stopTyping, typingUsers, onlineUsers } = useSocket();

    // Fetch conversations on component mount
    useEffect(() => {
        fetchConversations();
    }, []);

    // Set up socket listeners
    useEffect(() => {
        if (socket) {
            socket.on('new_message', handleNewMessage);
            socket.on('message_sent', handleMessageSent);
            socket.on('message_error', handleMessageError);

            return () => {
                socket.off('new_message');
                socket.off('message_sent');
                socket.off('message_error');
            };
        }
    }, [socket, selectedConversation]);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle window resize for mobile detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/chat/conversations');
            setConversations(response.data.conversations);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/following');
            setAvailableUsers(response.data.following || []);
        } catch (error) {
            console.error('Error fetching available users:', error);
            // Fallback: try to get all users
            try {
                const allUsersResponse = await axios.get('http://localhost:5000/api/users/all');
                setAvailableUsers(allUsersResponse.data.users || []);
            } catch (fallbackError) {
                console.error('Error fetching all users:', fallbackError);
            }
        }
    };

    const startNewConversation = async (userId) => {
        try {
            // Fetch messages for this user (will create conversation if doesn't exist)
            await fetchMessages(userId);
            setShowNewChatModal(false);
            setSearchQuery('');
        } catch (error) {
            console.error('Error starting new conversation:', error);
        }
    };

    const fetchMessages = async (userId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/chat/conversation/${userId}`);
            setMessages(response.data.messages);
            setSelectedConversation(response.data.otherUser);

            // On mobile, show chat area when conversation is selected
            if (isMobile) {
                setShowChatArea(true);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewMessage = (message) => {
        // Add message to current conversation if it's the selected one
        if (selectedConversation && 
            (message.sender._id === selectedConversation.id || message.receiver._id === selectedConversation.id)) {
            setMessages(prev => [...prev, message]);
        }
        
        // Update conversations list
        fetchConversations();
    };

    const handleMessageSent = (message) => {
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        fetchConversations();
    };

    const handleMessageError = (error) => {
        console.error('Message error:', error);
        alert('Failed to send message');
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && selectedConversation) {
            sendMessage(selectedConversation.id, newMessage.trim());
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        
        if (selectedConversation) {
            startTyping(selectedConversation.id);
            
            // Clear existing timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            
            // Set new timeout to stop typing
            const timeout = setTimeout(() => {
                stopTyping(selectedConversation.id);
            }, 1000);
            
            setTypingTimeout(timeout);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleBackToConversations = () => {
        setShowChatArea(false);
        setSelectedConversation(null);
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="chat-container">
            {/* Conversations Sidebar */}
            <div className={`conversations-sidebar ${isMobile && showChatArea ? 'hidden' : ''}`}>
                <div className="sidebar-header">
                    <h3>Messages</h3>
                    <button
                        className="new-chat-btn"
                        onClick={() => {
                            setShowNewChatModal(true);
                            fetchAvailableUsers();
                        }}
                        title="Start new conversation"
                    >
                        ✏️
                    </button>
                </div>
                <div className="conversations-list">
                    {conversations.map(conversation => (
                        <div
                            key={conversation._id}
                            className={`conversation-item ${selectedConversation?.id === conversation._id ? 'active' : ''}`}
                            onClick={() => fetchMessages(conversation._id)}
                        >
                            <div className="conversation-avatar">
                                {conversation.user.profilePicture ? (
                                    <img src={conversation.user.profilePicture} alt={conversation.user.fullName} />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {conversation.user.fullName?.charAt(0) || conversation.user.username?.charAt(0)}
                                    </div>
                                )}
                                {(conversation.user.isOnline || onlineUsers.has(conversation._id)) && (
                                    <div className="online-indicator"></div>
                                )}
                            </div>
                            <div className="conversation-info">
                                <div className="conversation-header">
                                    <h4>{conversation.user.fullName || conversation.user.username}</h4>
                                    <span className="message-time">
                                        {formatTime(conversation.lastMessage.createdAt)}
                                    </span>
                                </div>
                                <div className="last-message">
                                    <span className={conversation.unreadCount > 0 ? 'unread' : ''}>
                                        {conversation.lastMessage.content}
                                    </span>
                                    {conversation.unreadCount > 0 && (
                                        <span className="unread-count">{conversation.unreadCount}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`chat-area ${isMobile && showChatArea ? 'active' : ''}`}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="chat-header">
                            {isMobile && (
                                <button className="back-button" onClick={handleBackToConversations}>
                                    ←
                                </button>
                            )}
                            <div className="chat-user-info">
                                <div className="chat-avatar">
                                    {selectedConversation.profilePicture ? (
                                        <img src={selectedConversation.profilePicture} alt={selectedConversation.fullName} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {selectedConversation.fullName?.charAt(0) || selectedConversation.username?.charAt(0)}
                                        </div>
                                    )}
                                    {selectedConversation.isOnline && <div className="online-indicator"></div>}
                                </div>
                                <div>
                                    <h4>{selectedConversation.fullName || selectedConversation.username}</h4>
                                    <span className="user-status">
                                        {selectedConversation.isOnline ? 'Online' : `Last seen ${formatTime(selectedConversation.lastSeen)}`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="messages-container">
                            {loading ? (
                                <div className="loading">Loading messages...</div>
                            ) : (
                                <>
                                    {messages.map((message, index) => {
                                        const showDate = index === 0 || 
                                            formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);
                                        
                                        return (
                                            <div key={message._id}>
                                                {showDate && (
                                                    <div className="date-separator">
                                                        {formatDate(message.createdAt)}
                                                    </div>
                                                )}
                                                <div className={`message ${message.sender._id === user.id ? 'sent' : 'received'}`}>
                                                    <div className="message-content">
                                                        {message.content}
                                                    </div>
                                                    <div className="message-time">
                                                        {formatTime(message.createdAt)}
                                                        {message.sender._id === user.id && message.isRead && (
                                                            <span className="read-indicator">✓✓</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {/* Typing Indicator */}
                                    {typingUsers.has(selectedConversation.id) && (
                                        <div className="typing-indicator">
                                            <div className="typing-dots">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <span>{typingUsers.get(selectedConversation.id)} is typing...</span>
                                        </div>
                                    )}
                                    
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Message Input */}
                        <form className="message-input-form" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={handleTyping}
                                placeholder="Type a message..."
                                className="message-input"
                            />
                            <button type="submit" className="send-button" disabled={!newMessage.trim()}>
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="no-conversation">
                        <h3>Select a conversation to start messaging</h3>
                        <p>Choose from your existing conversations or start a new one by following someone.</p>
                    </div>
                )}
            </div>

            {/* New Chat Modal */}
            {showNewChatModal && (
                <div className="modal-overlay" onClick={() => setShowNewChatModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Start New Conversation</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowNewChatModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            <div className="users-list">
                                {availableUsers
                                    .filter(user =>
                                        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map(user => (
                                        <div
                                            key={user._id}
                                            className="user-item"
                                            onClick={() => startNewConversation(user._id)}
                                        >
                                            <div className="user-avatar">
                                                {user.profilePicture ? (
                                                    <img src={user.profilePicture} alt={user.fullName} />
                                                ) : (
                                                    <div className="avatar-placeholder">
                                                        {user.fullName?.charAt(0) || user.username?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="user-info">
                                                <div className="user-name">{user.fullName || user.username}</div>
                                                <div className="user-username">@{user.username}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                                {availableUsers.length === 0 && (
                                    <div className="no-users">
                                        <p>No users available to chat with.</p>
                                        <p>Follow some users to start conversations!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;

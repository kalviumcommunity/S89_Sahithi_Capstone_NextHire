import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [typingUsers, setTypingUsers] = useState(new Map());
    const { user, token, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && token && user) {
            // Initialize socket connection
            const newSocket = io('http://localhost:5000', {
                auth: {
                    token: token
                }
            });

            newSocket.on('connect', () => {
                console.log('Connected to server');
                setSocket(newSocket);
            });

            newSocket.on('disconnect', () => {
                console.log('Disconnected from server');
                setSocket(null);
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });

            // Handle typing indicators
            newSocket.on('user_typing', (data) => {
                setTypingUsers(prev => {
                    const newMap = new Map(prev);
                    newMap.set(data.userId, data.username);
                    return newMap;
                });
            });

            newSocket.on('user_stopped_typing', (data) => {
                setTypingUsers(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(data.userId);
                    return newMap;
                });
            });

            // Handle online users
            newSocket.on('user_online', (data) => {
                setOnlineUsers(prev => new Set([...prev, data.userId]));
            });

            newSocket.on('user_offline', (data) => {
                setOnlineUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(data.userId);
                    return newSet;
                });
            });

            newSocket.on('online_users', (data) => {
                setOnlineUsers(new Set(data.userIds));
            });

            return () => {
                newSocket.close();
            };
        } else {
            // Clean up socket when user logs out
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [isAuthenticated, token, user]);

    const sendMessage = (receiverId, content, messageType = 'text') => {
        if (socket) {
            socket.emit('send_message', {
                receiverId,
                content,
                messageType
            });
        }
    };

    const startTyping = (receiverId) => {
        if (socket) {
            socket.emit('typing_start', { receiverId });
        }
    };

    const stopTyping = (receiverId) => {
        if (socket) {
            socket.emit('typing_stop', { receiverId });
        }
    };

    const value = {
        socket,
        onlineUsers,
        typingUsers,
        sendMessage,
        startTyping,
        stopTyping,
        isConnected: !!socket
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

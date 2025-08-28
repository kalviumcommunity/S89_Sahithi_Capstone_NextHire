import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('Error parsing saved user data:', error);
            localStorage.removeItem('user');
            return null;
        }
    });
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Helper function to safely save user data
    const saveUserToStorage = (userData) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Error saving user data to localStorage:', error);
        }
    };

    // Set up axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Check if user is logged in on app start
    useEffect(() => {
        const checkAuth = async () => {
            if (token && !user) {
                try {
                    const response = await axios.get('http://localhost:5000/api/auth/me');
                    const userData = response.data.user;
                    setUser(userData);
                    saveUserToStorage(userData);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            console.log('Attempting login with:', { email, password: '***' });
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            console.log('Login response:', response.data);
            const { token: newToken, user: userData } = response.data;

            setToken(newToken);
            setUser(userData);
            localStorage.setItem('token', newToken);
            saveUserToStorage(userData);

            return { success: true, message: response.data.message };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const signup = async (email, password, username, fullName) => {
        try {
            console.log('Attempting signup with:', { email, username, fullName, password: '***' });
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                email,
                password,
                username,
                fullName
            });

            console.log('Signup response:', response.data);
            const { token: newToken, user: userData } = response.data;

            setToken(newToken);
            setUser(userData);
            localStorage.setItem('token', newToken);
            saveUserToStorage(userData);

            return { success: true, message: response.data.message };
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post('http://localhost:5000/api/auth/logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const updateUser = (userData) => {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        saveUserToStorage(updatedUser);
    };

    const refreshUser = async () => {
        if (token) {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/me');
                const userData = response.data.user;
                setUser(userData);
                saveUserToStorage(userData);
                return userData;
            } catch (error) {
                console.error('Failed to refresh user data:', error);
                return null;
            }
        }
        return null;
    };

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

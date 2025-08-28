const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Signup endpoint
router.post('/signup', async (req, res) => {
    try {
        console.log('=== SIGNUP REQUEST START ===');
        console.log('Request body:', req.body);
        console.log('Signup request received:', { email: req.body.email, username: req.body.username });
        const { email, password, username, fullName } = req.body;

        // Validation
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Email, password, and username are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            email,
            password: hashedPassword,
            username,
            fullName: fullName || username
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        console.log('User created successfully:', user._id);
        console.log('Token generated:', token ? 'Yes' : 'No');

        res.status(201).json({
            message: 'Signup successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                fullName: user.fullName
            }
        });
        console.log('=== SIGNUP REQUEST SUCCESS ===');
    } catch (error) {
        console.error('=== SIGNUP ERROR ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', { email: req.body.email });
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update online status
        user.isOnline = true;
        user.lastSeen = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
                bio: user.bio,
                profilePicture: user.profilePicture,
                followerCount: user.followerCount,
                followingCount: user.followingCount
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Logout endpoint
router.post('/logout', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.isOnline = false;
        user.lastSeen = new Date();
        await user.save();

        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('followers', 'username fullName profilePicture')
            .populate('following', 'username fullName profilePicture')
            .select('-password');

        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

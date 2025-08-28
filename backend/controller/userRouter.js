const express = require('express');
const User = require('../models/userSchema');
const auth = require('../middleware/auth');

const router = express.Router();

// Search users
router.get('/search', auth, async (req, res) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        
        if (!query || query.trim().length < 2) {
            return res.status(400).json({ message: 'Search query must be at least 2 characters long' });
        }

        const searchRegex = new RegExp(query.trim(), 'i');
        const skip = (page - 1) * limit;

        const users = await User.find({
            $and: [
                { _id: { $ne: req.user._id } }, // Exclude current user
                {
                    $or: [
                        { username: searchRegex },
                        { fullName: searchRegex },
                        { email: searchRegex }
                    ]
                }
            ]
        })
        .select('username fullName email profilePicture bio followerCount followingCount')
        .limit(parseInt(limit))
        .skip(skip)
        .sort({ username: 1 });

        // Add isFollowing status for each user
        const usersWithFollowStatus = users.map(user => ({
            ...user.toObject(),
            isFollowing: req.user.following.includes(user._id)
        }));

        res.json({
            users: usersWithFollowStatus,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                hasMore: users.length === parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ message: 'Server error during search' });
    }
});

// Get user profile by username
router.get('/profile/:username', auth, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .populate('followers', 'username fullName profilePicture')
            .populate('following', 'username fullName profilePicture')
            .select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userProfile = {
            ...user.toObject(),
            isFollowing: req.user.following.includes(user._id),
            isOwnProfile: user._id.equals(req.user._id)
        };

        res.json({ user: userProfile });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Follow a user
router.post('/follow/:userId', auth, async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUser = req.user;

        // Check if trying to follow self
        if (targetUserId === currentUser._id.toString()) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        // Check if target user exists
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already following
        if (currentUser.following.includes(targetUserId)) {
            return res.status(400).json({ message: 'You are already following this user' });
        }

        // Follow the user
        await currentUser.follow(targetUserId);

        // Get updated user data with new counts
        const updatedUser = await User.findById(currentUser._id)
            .select('-password');

        res.json({
            message: 'User followed successfully',
            isFollowing: true,
            user: updatedUser
        });
    } catch (error) {
        console.error('Follow user error:', error);
        res.status(500).json({ message: 'Server error during follow' });
    }
});

// Unfollow a user
router.post('/unfollow/:userId', auth, async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUser = req.user;

        // Check if trying to unfollow self
        if (targetUserId === currentUser._id.toString()) {
            return res.status(400).json({ message: 'You cannot unfollow yourself' });
        }

        // Check if target user exists
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if not following
        if (!currentUser.following.includes(targetUserId)) {
            return res.status(400).json({ message: 'You are not following this user' });
        }

        // Unfollow the user
        await currentUser.unfollow(targetUserId);

        // Get updated user data with new counts
        const updatedUser = await User.findById(currentUser._id)
            .select('-password');

        res.json({
            message: 'User unfollowed successfully',
            isFollowing: false,
            user: updatedUser
        });
    } catch (error) {
        console.error('Unfollow user error:', error);
        res.status(500).json({ message: 'Server error during unfollow' });
    }
});

// Get followers list
router.get('/followers/:userId?', auth, async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id;
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const user = await User.findById(userId)
            .populate({
                path: 'followers',
                select: 'username fullName profilePicture bio',
                options: {
                    limit: parseInt(limit),
                    skip: skip,
                    sort: { username: 1 }
                }
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add isFollowing status for each follower
        const followersWithStatus = user.followers.map(follower => ({
            ...follower.toObject(),
            isFollowing: req.user.following.includes(follower._id)
        }));

        res.json({
            followers: followersWithStatus,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                hasMore: user.followers.length === parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get followers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get following list
router.get('/following/:userId?', auth, async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id;
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const user = await User.findById(userId)
            .populate({
                path: 'following',
                select: 'username fullName profilePicture bio',
                options: {
                    limit: parseInt(limit),
                    skip: skip,
                    sort: { username: 1 }
                }
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add isFollowing status for each following user
        const followingWithStatus = user.following.map(followingUser => ({
            ...followingUser.toObject(),
            isFollowing: req.user.following.includes(followingUser._id)
        }));

        res.json({
            following: followingWithStatus,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                hasMore: user.following.length === parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get following error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get suggested users to follow
router.get('/suggestions', auth, async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const currentUser = req.user;

        // Get users that current user is not following
        const suggestions = await User.find({
            $and: [
                { _id: { $ne: currentUser._id } },
                { _id: { $nin: currentUser.following } }
            ]
        })
        .select('username fullName profilePicture bio followerCount')
        .limit(parseInt(limit))
        .sort({ followerCount: -1 }); // Sort by popularity

        res.json({ suggestions });
    } catch (error) {
        console.error('Get suggestions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { fullName, bio, profilePicture } = req.body;
        const userId = req.user._id;

        // Validate input
        if (fullName && fullName.length > 100) {
            return res.status(400).json({ message: 'Full name must be less than 100 characters' });
        }

        if (bio && bio.length > 500) {
            return res.status(400).json({ message: 'Bio must be less than 500 characters' });
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...(fullName !== undefined && { fullName }),
                ...(bio !== undefined && { bio }),
                ...(profilePicture !== undefined && { profilePicture })
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
});

// Get all users (for chat functionality)
router.get('/all', auth, async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Get all users except current user
        const users = await User.find({
            _id: { $ne: currentUserId },
            isDeleted: { $ne: true }
        })
        .select('username fullName profilePicture isOnline lastSeen')
        .limit(50)
        .sort({ username: 1 });

        res.json({
            message: 'Users retrieved successfully',
            users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
});

module.exports = router;

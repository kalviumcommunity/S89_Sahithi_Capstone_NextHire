const express = require('express');
const Post = require('../models/postSchema');
const User = require('../models/userSchema');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new post
router.post('/create', auth, async (req, res) => {
    try {
        console.log('Create post request received:', { userId: req.user._id, content: req.body.content?.substring(0, 50) + '...' });
        const { content, image } = req.body;

        // Validation
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Post content is required' });
        }

        if (content.length > 2000) {
            return res.status(400).json({ message: 'Post content must be less than 2000 characters' });
        }

        // Create post
        const post = new Post({
            author: req.user._id,
            content: content.trim(),
            image: image || ''
        });

        await post.save();

        // Populate author info for response
        await post.populate('author', 'username fullName profilePicture');

        res.status(201).json({
            message: 'Post created successfully',
            post
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ message: 'Server error while creating post' });
    }
});

// Get posts feed (posts from followed users + own posts)
router.get('/feed', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const currentUser = req.user;

        // Get posts from followed users and own posts
        const authorIds = [...currentUser.following, currentUser._id];

        const posts = await Post.find({
            author: { $in: authorIds },
            isDeleted: false
        })
        .populate('author', 'username fullName profilePicture')
        .populate('comments.user', 'username fullName profilePicture')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

        // Add isLiked status for each post
        const postsWithLikeStatus = posts.map(post => ({
            ...post.toObject(),
            isLiked: post.isLikedBy(currentUser._id)
        }));

        res.json({
            posts: postsWithLikeStatus,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                hasMore: posts.length === parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get feed error:', error);
        res.status(500).json({ message: 'Server error while fetching feed' });
    }
});

// Get user's posts
router.get('/user/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const posts = await Post.find({
            author: userId,
            isDeleted: false
        })
        .populate('author', 'username fullName profilePicture')
        .populate('comments.user', 'username fullName profilePicture')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

        // Add isLiked status for each post
        const postsWithLikeStatus = posts.map(post => ({
            ...post.toObject(),
            isLiked: post.isLikedBy(req.user._id)
        }));

        res.json({
            posts: postsWithLikeStatus,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                hasMore: posts.length === parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get user posts error:', error);
        res.status(500).json({ message: 'Server error while fetching user posts' });
    }
});

// Like/Unlike a post
router.post('/:postId/like', auth, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const isLiked = post.isLikedBy(userId);
        
        if (isLiked) {
            await post.unlike(userId);
        } else {
            await post.like(userId);
        }

        res.json({
            message: isLiked ? 'Post unliked' : 'Post liked',
            isLiked: !isLiked,
            likeCount: post.likeCount
        });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ message: 'Server error while liking post' });
    }
});

// Add comment to post
router.post('/:postId/comment', auth, async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await post.addComment(userId, content);
        
        // Populate the new comment
        await post.populate('comments.user', 'username fullName profilePicture');
        const populatedComment = post.comments[post.comments.length - 1];

        res.status(201).json({
            message: 'Comment added successfully',
            comment: populatedComment,
            commentCount: post.commentCount
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Server error while adding comment' });
    }
});

// Edit a post
router.put('/:postId', auth, async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, image } = req.body;
        const userId = req.user._id;

        // Validation
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Post content is required' });
        }

        if (content.length > 2000) {
            return res.status(400).json({ message: 'Post content must be less than 2000 characters' });
        }

        const post = await Post.findOne({
            _id: postId,
            author: userId,
            isDeleted: false
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found or you are not authorized to edit it' });
        }

        // Update post
        post.content = content.trim();
        if (image !== undefined) {
            post.image = image || '';
        }

        await post.save();

        // Populate author info for response
        await post.populate('author', 'username fullName profilePicture');

        res.json({
            message: 'Post updated successfully',
            post
        });
    } catch (error) {
        console.error('Edit post error:', error);
        res.status(500).json({ message: 'Server error while editing post' });
    }
});

// Delete a post
router.delete('/:postId', auth, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findOne({
            _id: postId,
            author: userId
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found or you are not authorized to delete it' });
        }

        post.isDeleted = true;
        await post.save();

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ message: 'Server error while deleting post' });
    }
});

// Get post count for user
router.get('/count/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        
        const postCount = await Post.countDocuments({
            author: userId,
            isDeleted: false
        });

        res.json({ postCount });
    } catch (error) {
        console.error('Get post count error:', error);
        res.status(500).json({ message: 'Server error while fetching post count' });
    }
});

module.exports = router;

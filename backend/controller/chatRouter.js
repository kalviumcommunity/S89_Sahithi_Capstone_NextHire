const express = require('express');
const Message = require('../models/messageSchema');
const User = require('../models/userSchema');
const auth = require('../middleware/auth');

const router = express.Router();

// Send a message
router.post('/send', auth, async (req, res) => {
    try {
        const { receiverId, content, messageType = 'text' } = req.body;
        const senderId = req.user._id;

        if (!receiverId || !content) {
            return res.status(400).json({ message: 'Receiver ID and content are required' });
        }

        if (content.trim().length === 0) {
            return res.status(400).json({ message: 'Message content cannot be empty' });
        }

        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Check if users follow each other (optional - you can remove this if you want open messaging)
        const sender = await User.findById(senderId);
        const canMessage = sender.following.includes(receiverId) || receiver.following.includes(senderId);
        
        if (!canMessage) {
            return res.status(403).json({ 
                message: 'You can only message users you follow or who follow you' 
            });
        }

        // Create message
        const message = new Message({
            sender: senderId,
            receiver: receiverId,
            content: content.trim(),
            messageType
        });

        await message.save();

        // Populate sender info for response
        await message.populate('sender', 'username fullName profilePicture');

        res.status(201).json({
            message: 'Message sent successfully',
            data: message
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Server error while sending message' });
    }
});

// Get conversation between two users
router.get('/conversation/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;
        const { page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;

        // Check if the other user exists
        const otherUser = await User.findById(userId);
        if (!otherUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get messages between the two users
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ],
            isDeleted: false
        })
        .populate('sender', 'username fullName profilePicture')
        .populate('receiver', 'username fullName profilePicture')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

        // Mark messages as read if they were sent to current user
        const unreadMessages = messages.filter(msg => 
            msg.receiver._id.equals(currentUserId) && !msg.isRead
        );

        if (unreadMessages.length > 0) {
            await Message.updateMany(
                {
                    _id: { $in: unreadMessages.map(msg => msg._id) }
                },
                {
                    isRead: true,
                    readAt: new Date()
                }
            );
        }

        res.json({
            messages: messages.reverse(), // Reverse to show oldest first
            otherUser: {
                id: otherUser._id,
                username: otherUser.username,
                fullName: otherUser.fullName,
                profilePicture: otherUser.profilePicture,
                isOnline: otherUser.isOnline,
                lastSeen: otherUser.lastSeen
            },
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                hasMore: messages.length === parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({ message: 'Server error while fetching conversation' });
    }
});

// Get all conversations for current user
router.get('/conversations', auth, async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const { page = 1, limit = 20 } = req.query;

        // Aggregate to get latest message for each conversation
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: currentUserId },
                        { receiver: currentUserId }
                    ],
                    isDeleted: false
                }
            },
            {
                $addFields: {
                    otherUser: {
                        $cond: {
                            if: { $eq: ['$sender', currentUserId] },
                            then: '$receiver',
                            else: '$sender'
                        }
                    }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: '$otherUser',
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$receiver', currentUserId] },
                                        { $eq: ['$isRead', false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                $unwind: '$userInfo'
            },
            {
                $project: {
                    _id: 1,
                    lastMessage: 1,
                    unreadCount: 1,
                    user: {
                        id: '$userInfo._id',
                        username: '$userInfo.username',
                        fullName: '$userInfo.fullName',
                        profilePicture: '$userInfo.profilePicture',
                        isOnline: '$userInfo.isOnline',
                        lastSeen: '$userInfo.lastSeen'
                    }
                }
            },
            {
                $sort: { 'lastMessage.createdAt': -1 }
            },
            {
                $skip: (page - 1) * parseInt(limit)
            },
            {
                $limit: parseInt(limit)
            }
        ]);

        res.json({
            conversations,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                hasMore: conversations.length === parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ message: 'Server error while fetching conversations' });
    }
});

// Mark messages as read
router.put('/mark-read/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        await Message.updateMany(
            {
                sender: userId,
                receiver: currentUserId,
                isRead: false
            },
            {
                isRead: true,
                readAt: new Date()
            }
        );

        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        console.error('Mark messages as read error:', error);
        res.status(500).json({ message: 'Server error while marking messages as read' });
    }
});

// Delete a message
router.delete('/:messageId', auth, async (req, res) => {
    try {
        const { messageId } = req.params;
        const currentUserId = req.user._id;

        const message = await Message.findOne({
            _id: messageId,
            sender: currentUserId
        });

        if (!message) {
            return res.status(404).json({ message: 'Message not found or you are not authorized to delete it' });
        }

        message.isDeleted = true;
        await message.save();

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ message: 'Server error while deleting message' });
    }
});

// Get unread message count
router.get('/unread-count', auth, async (req, res) => {
    try {
        const currentUserId = req.user._id;

        const unreadCount = await Message.countDocuments({
            receiver: currentUserId,
            isRead: false,
            isDeleted: false
        });

        res.json({ unreadCount });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ message: 'Server error while fetching unread count' });
    }
});

module.exports = router;

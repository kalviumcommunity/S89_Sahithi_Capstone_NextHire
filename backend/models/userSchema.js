const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        index: true
    },
    fullName: {
        type: String,
        trim: true,
        maxlength: 100
    },
    bio: {
        type: String,
        maxlength: 500,
        default: ''
    },
    profilePicture: {
        type: String,
        default: ''
    },
    followers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for better search performance
userSchema.index({ fullName: 'text', username: 'text' });

// Virtual for follower count
userSchema.virtual('followerCount').get(function() {
    return this.followers ? this.followers.length : 0;
});

// Virtual for following count
userSchema.virtual('followingCount').get(function() {
    return this.following ? this.following.length : 0;
});

// Method to check if user follows another user
userSchema.methods.isFollowing = function(userId) {
    return this.following.includes(userId);
};

// Method to follow a user
userSchema.methods.follow = async function(userId) {
    if (!this.following.includes(userId)) {
        this.following.push(userId);
        await this.save();
        
        // Add this user to the target user's followers
        const targetUser = await this.constructor.findById(userId);
        if (targetUser && !targetUser.followers.includes(this._id)) {
            targetUser.followers.push(this._id);
            await targetUser.save();
        }
    }
};

// Method to unfollow a user
userSchema.methods.unfollow = async function(userId) {
    this.following = this.following.filter(id => !id.equals(userId));
    await this.save();
    
    // Remove this user from the target user's followers
    const targetUser = await this.constructor.findById(userId);
    if (targetUser) {
        targetUser.followers = targetUser.followers.filter(id => !id.equals(this._id));
        await targetUser.save();
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;

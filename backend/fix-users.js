const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// User schema (simplified)
const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    fullName: String,
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
    }
});

const User = mongoose.model('User', userSchema);

async function fixUsers() {
    try {
        console.log('Starting user fix...');
        
        // Find all users where followers or following is undefined/null
        const usersToFix = await User.find({
            $or: [
                { followers: { $exists: false } },
                { following: { $exists: false } },
                { followers: null },
                { following: null }
            ]
        });
        
        console.log(`Found ${usersToFix.length} users to fix`);
        
        for (const user of usersToFix) {
            console.log(`Fixing user: ${user.username || user.email}`);
            
            // Initialize arrays if they don't exist
            if (!user.followers) user.followers = [];
            if (!user.following) user.following = [];
            
            await user.save();
        }
        
        console.log('All users fixed successfully!');
        
        // Verify the fix
        const allUsers = await User.find({});
        console.log(`Total users in database: ${allUsers.length}`);
        
        for (const user of allUsers) {
            console.log(`User ${user.username}: followers=${user.followers?.length || 0}, following=${user.following?.length || 0}`);
        }
        
    } catch (error) {
        console.error('Error fixing users:', error);
    } finally {
        mongoose.connection.close();
    }
}

fixUsers();

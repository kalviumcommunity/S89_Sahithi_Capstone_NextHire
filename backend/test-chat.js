const axios = require('axios');

async function testChat() {
    try {
        console.log('Testing chat functionality...');
        
        // First login to get a token
        const loginData = {
            email: 'bhumireddysahithi@gmail.com',
            password: 'Sa@041006'
        };
        
        console.log('Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', loginData);
        const token = loginResponse.data.token;
        const userId = loginResponse.data.user.id;
        console.log('Login successful, user ID:', userId);
        
        // Test getting all users
        console.log('Fetching all users...');
        const usersResponse = await axios.get('http://localhost:5000/api/users/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Available users:', usersResponse.data.users.length);
        usersResponse.data.users.forEach(user => {
            console.log(`- ${user.fullName} (@${user.username}) - ${user._id}`);
        });
        
        // Test getting conversations
        console.log('Fetching conversations...');
        const conversationsResponse = await axios.get('http://localhost:5000/api/chat/conversations', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Existing conversations:', conversationsResponse.data.conversations.length);
        
        // If there are users available, test sending a message
        if (usersResponse.data.users.length > 0) {
            const targetUser = usersResponse.data.users[0];
            console.log(`Sending test message to ${targetUser.fullName}...`);
            
            const messageData = {
                receiverId: targetUser._id,
                content: 'Hello! This is a test message from the chat system.',
                messageType: 'text'
            };
            
            const sendResponse = await axios.post('http://localhost:5000/api/chat/send', messageData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Message sent successfully!');
            console.log('Message details:', sendResponse.data.data);
            
            // Test getting conversation with this user
            console.log('Fetching conversation...');
            const conversationResponse = await axios.get(`http://localhost:5000/api/chat/conversation/${targetUser._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Conversation messages:', conversationResponse.data.messages.length);
            console.log('Other user info:', conversationResponse.data.otherUser);
        }
        
        console.log('✅ Chat functionality test completed successfully!');
        
    } catch (error) {
        console.error('❌ Error occurred:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
    }
}

testChat();

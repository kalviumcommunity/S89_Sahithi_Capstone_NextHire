const axios = require('axios');

async function testEditPost() {
    try {
        console.log('Testing post edit functionality...');
        
        // First login to get a token
        const loginData = {
            email: 'bhumireddysahithi@gmail.com',
            password: 'Sa@041006'
        };
        
        console.log('Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', loginData);
        const token = loginResponse.data.token;
        console.log('Login successful');
        
        // Create a post first
        const postData = {
            content: 'Original post content for testing edit functionality',
            image: ''
        };
        
        console.log('Creating a test post...');
        const createResponse = await axios.post('http://localhost:5000/api/posts/create', postData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const postId = createResponse.data.post._id;
        console.log('Post created with ID:', postId);
        console.log('Original content:', createResponse.data.post.content);
        
        // Now edit the post
        const editData = {
            content: 'EDITED: This post has been successfully edited!',
            image: 'https://via.placeholder.com/400x200'
        };
        
        console.log('Editing the post...');
        const editResponse = await axios.put(`http://localhost:5000/api/posts/${postId}`, editData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Post edited successfully!');
        console.log('New content:', editResponse.data.post.content);
        console.log('New image:', editResponse.data.post.image);
        console.log('Updated at:', editResponse.data.post.updatedAt);
        
        // Clean up - delete the test post
        console.log('Cleaning up - deleting test post...');
        await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Test post deleted successfully');
        
    } catch (error) {
        console.error('Error occurred:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
    }
}

testEditPost();

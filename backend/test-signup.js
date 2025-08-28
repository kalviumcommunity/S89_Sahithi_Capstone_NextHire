const axios = require('axios');

async function testPost() {
    try {
        console.log('Testing post creation...');

        // First login to get a token
        const loginData = {
            email: 'bhumireddysahithi@gmail.com',
            password: 'Sa@041006'
        };

        console.log('Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', loginData);
        const token = loginResponse.data.token;
        console.log('Login successful, token received');

        // Now create a post
        const postData = {
            content: 'This is a test post from the backend script!',
            image: ''
        };

        console.log('Creating post...');
        const postResponse = await axios.post('http://localhost:5000/api/posts/create', postData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Post created successfully!');
        console.log('Post data:', postResponse.data);

    } catch (error) {
        console.error('Error occurred:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
    }
}

testPost();

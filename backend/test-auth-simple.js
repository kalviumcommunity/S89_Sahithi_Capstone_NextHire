const axios = require('axios');

async function testAuth() {
    try {
        console.log('Testing authentication endpoints...');
        
        // Test signup
        const signupData = {
            email: 'test' + Date.now() + '@example.com',
            password: 'password123',
            username: 'testuser' + Date.now(),
            fullName: 'Test User'
        };
        
        console.log('Testing signup...');
        console.log('Signup data:', signupData);
        
        const signupResponse = await axios.post('http://localhost:5000/api/auth/signup', signupData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Signup successful!');
        console.log('Response:', signupResponse.data);
        
        // Test login with the same credentials
        const loginData = {
            email: signupData.email,
            password: signupData.password
        };
        
        console.log('Testing login...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', loginData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Login successful!');
        console.log('Response:', loginResponse.data);
        
    } catch (error) {
        console.error('❌ Error occurred:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
        console.error('URL:', error.config?.url);
    }
}

testAuth();

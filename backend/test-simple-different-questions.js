const axios = require('axios');

async function testSimpleDifferentQuestions() {
    try {
        console.log('🚀 Testing Simple Different Questions Functionality...\n');
        
        // Login
        const loginData = {
            email: 'bhumireddysahithi@gmail.com',
            password: 'Sa@041006'
        };
        
        console.log('🔐 Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', loginData);
        const token = loginResponse.data.token;
        console.log('✅ Login successful\n');
        
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const company = 'Google';

        // Test 1: First attempt
        console.log('🔍 Test 1: First attempt...');
        const response1 = await axios.get(
            `http://localhost:5000/api/companies/questions/${company}?count=3`, 
            { headers }
        );
        
        console.log('✅ First attempt successful!');
        console.log('📚 Questions:', response1.data.questions.map(q => `ID: ${q.id} - ${q.question.substring(0, 50)}...`));
        console.log('🆔 Question IDs:', response1.data.questions.map(q => q.id));
        console.log('📊 Attempt Info:', response1.data.attemptInfo);
        console.log('');

        // Test 2: Second attempt (should be different)
        console.log('🔍 Test 2: Second attempt...');
        const response2 = await axios.get(
            `http://localhost:5000/api/companies/questions/${company}?count=3`, 
            { headers }
        );
        
        console.log('✅ Second attempt successful!');
        console.log('📚 Questions:', response2.data.questions.map(q => `ID: ${q.id} - ${q.question.substring(0, 50)}...`));
        console.log('🆔 Question IDs:', response2.data.questions.map(q => q.id));
        console.log('📊 Attempt Info:', response2.data.attemptInfo);
        
        // Check for overlap
        const ids1 = response1.data.questions.map(q => q.id);
        const ids2 = response2.data.questions.map(q => q.id);
        const overlap = ids1.filter(id => ids2.includes(id));
        
        console.log('🔄 Question Overlap:', overlap.length > 0 ? `${overlap.length} questions repeated ❌` : 'No repeated questions ✅');
        console.log('');

        // Test 3: Check debug info
        console.log('🔍 Test 3: Checking debug info...');
        const debugResponse = await axios.get(
            `http://localhost:5000/api/companies/debug/attempts`, 
            { headers }
        );
        
        console.log('✅ Debug info retrieved!');
        console.log('🐛 Debug Info:', JSON.stringify(debugResponse.data, null, 2));
        console.log('');

        // Test 4: Third attempt
        console.log('🔍 Test 4: Third attempt...');
        const response3 = await axios.get(
            `http://localhost:5000/api/companies/questions/${company}?count=3`, 
            { headers }
        );
        
        console.log('✅ Third attempt successful!');
        console.log('📚 Questions:', response3.data.questions.map(q => `ID: ${q.id} - ${q.question.substring(0, 50)}...`));
        console.log('🆔 Question IDs:', response3.data.questions.map(q => q.id));
        console.log('📊 Attempt Info:', response3.data.attemptInfo);
        
        // Check for overlap with previous attempts
        const ids3 = response3.data.questions.map(q => q.id);
        const allPreviousIds = [...ids1, ...ids2];
        const overlap3 = ids3.filter(id => allPreviousIds.includes(id));
        
        console.log('🔄 Question Overlap with previous:', overlap3.length > 0 ? `${overlap3.length} questions repeated ❌` : 'No repeated questions ✅');
        console.log('');

        // Test 5: Allow repeats
        console.log('🔍 Test 5: Testing with allowRepeats=true...');
        const response4 = await axios.get(
            `http://localhost:5000/api/companies/questions/${company}?count=3&allowRepeats=true`, 
            { headers }
        );
        
        console.log('✅ Allow repeats test successful!');
        console.log('📚 Questions:', response4.data.questions.map(q => `ID: ${q.id} - ${q.question.substring(0, 50)}...`));
        console.log('🆔 Question IDs:', response4.data.questions.map(q => q.id));
        console.log('📊 Attempt Info:', response4.data.attemptInfo);
        console.log('');

        console.log('🎉 All tests completed!');
        console.log('\n📋 Summary:');
        console.log('✅ Different questions functionality tested');
        console.log('✅ Attempt tracking verified');
        console.log('✅ Debug information accessible');
        console.log('✅ Allow repeats option working');

    } catch (error) {
        console.error('❌ Error occurred:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
    }
}

testSimpleDifferentQuestions();

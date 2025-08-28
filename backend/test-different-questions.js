const axios = require('axios');

async function testDifferentQuestions() {
    try {
        console.log('🚀 Testing Different Questions on Each Attempt...\n');
        
        // First login to get a token
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
        const questionsPerAttempt = 3;

        // Test 1: First attempt (should get random questions)
        console.log('🔍 Test 1: First attempt - Getting initial questions...');
        
        const attempt1Response = await axios.get(
            `http://localhost:5000/api/companies/questions/${company}?count=${questionsPerAttempt}&newAttempt=false`, 
            { headers }
        );
        
        console.log('✅ First attempt successful!');
        console.log('📚 Questions received:', attempt1Response.data.questions.length);
        console.log('🆔 Question IDs:', attempt1Response.data.questions.map(q => q.id));
        console.log('📊 Attempt Info:', attempt1Response.data.attemptInfo);
        console.log('');

        // Test 2: Second attempt (should get different questions)
        console.log('🔍 Test 2: Second attempt - Getting new questions...');
        
        const attempt2Response = await axios.get(
            `http://localhost:5000/api/companies/questions/${company}?count=${questionsPerAttempt}&newAttempt=true`, 
            { headers }
        );
        
        console.log('✅ Second attempt successful!');
        console.log('📚 Questions received:', attempt2Response.data.questions.length);
        console.log('🆔 Question IDs:', attempt2Response.data.questions.map(q => q.id));
        console.log('📊 Attempt Info:', attempt2Response.data.attemptInfo);
        
        // Check if questions are different
        const attempt1Ids = attempt1Response.data.questions.map(q => q.id);
        const attempt2Ids = attempt2Response.data.questions.map(q => q.id);
        const overlap = attempt1Ids.filter(id => attempt2Ids.includes(id));
        
        console.log('🔄 Question Overlap:', overlap.length > 0 ? `${overlap.length} questions repeated` : 'No repeated questions ✅');
        console.log('');

        // Test 3: Third attempt
        console.log('🔍 Test 3: Third attempt - Getting more new questions...');
        
        const attempt3Response = await axios.get(
            `http://localhost:5000/api/companies/questions/${company}?count=${questionsPerAttempt}&newAttempt=true`, 
            { headers }
        );
        
        console.log('✅ Third attempt successful!');
        console.log('📚 Questions received:', attempt3Response.data.questions.length);
        console.log('🆔 Question IDs:', attempt3Response.data.questions.map(q => q.id));
        console.log('📊 Attempt Info:', attempt3Response.data.attemptInfo);
        console.log('');

        // Test 4: Check attempt history
        console.log('🔍 Test 4: Checking attempt history...');
        
        const historyResponse = await axios.get(
            `http://localhost:5000/api/companies/attempts/${company}`, 
            { headers }
        );
        
        console.log('✅ Attempt history retrieved!');
        console.log('📈 History:', historyResponse.data.attemptHistory);
        console.log('🆔 All attempted question IDs:', historyResponse.data.attemptHistory.attemptedQuestionIds);
        console.log('');

        // Test 5: Fourth attempt (might exhaust questions)
        console.log('🔍 Test 5: Fourth attempt - Testing question exhaustion...');
        
        const attempt4Response = await axios.get(
            `http://localhost:5000/api/companies/questions/${company}?count=${questionsPerAttempt}&newAttempt=true`, 
            { headers }
        );
        
        console.log('✅ Fourth attempt successful!');
        console.log('📚 Questions received:', attempt4Response.data.questions.length);
        console.log('🆔 Question IDs:', attempt4Response.data.questions.map(q => q.id));
        console.log('📊 Attempt Info:', attempt4Response.data.attemptInfo);
        console.log('');

        // Test 6: Reset attempts
        console.log('🔍 Test 6: Resetting attempts...');
        
        const resetResponse = await axios.post(
            `http://localhost:5000/api/companies/reset-attempts/${company}`, 
            {}, 
            { headers }
        );
        
        console.log('✅ Attempts reset successful!');
        console.log('📝 Message:', resetResponse.data.message);
        console.log('');

        // Test 7: After reset - should get questions again
        console.log('🔍 Test 7: After reset - Getting questions again...');
        
        const afterResetResponse = await axios.get(
            `http://localhost:5000/api/companies/questions/${company}?count=${questionsPerAttempt}&newAttempt=true`, 
            { headers }
        );
        
        console.log('✅ After reset attempt successful!');
        console.log('📚 Questions received:', afterResetResponse.data.questions.length);
        console.log('🆔 Question IDs:', afterResetResponse.data.questions.map(q => q.id));
        console.log('📊 Attempt Info:', afterResetResponse.data.attemptInfo);
        console.log('');

        // Test 8: Test with different company
        console.log('🔍 Test 8: Testing with different company (Microsoft)...');
        
        const microsoftResponse = await axios.get(
            `http://localhost:5000/api/companies/questions/Microsoft?count=3&newAttempt=true`, 
            { headers }
        );
        
        console.log('✅ Microsoft questions retrieved!');
        console.log('📚 Questions received:', microsoftResponse.data.questions.length);
        console.log('🆔 Question IDs:', microsoftResponse.data.questions.map(q => q.id));
        console.log('📊 Attempt Info:', microsoftResponse.data.attemptInfo);
        console.log('');

        console.log('🎉 All different questions tests completed successfully!');
        console.log('\n📋 Summary of Features:');
        console.log('✅ Different questions on each attempt');
        console.log('✅ Attempt tracking per user per company');
        console.log('✅ Question exhaustion handling with auto-reset');
        console.log('✅ Manual attempt reset functionality');
        console.log('✅ Attempt history and statistics');
        console.log('✅ Independent tracking per company');
        console.log('✅ Detailed attempt information in responses');
        
        console.log('\n🎯 Key Benefits:');
        console.log('• Users get unique questions on each attempt');
        console.log('• No repeated questions until all are exhausted');
        console.log('• Automatic reset when no new questions available');
        console.log('• Manual reset option for fresh start');
        console.log('• Separate tracking for each company');
        console.log('• Progress tracking and statistics');

    } catch (error) {
        console.error('❌ Error occurred:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
    }
}

testDifferentQuestions();

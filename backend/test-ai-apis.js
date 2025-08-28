const axios = require('axios');

async function testAIAPIs() {
    try {
        console.log('🚀 Testing AI-powered APIs...\n');
        
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

        // Test Company Questions API
        console.log('📚 Testing Company Questions API...');
        
        // Get all companies
        const companiesResponse = await axios.get('http://localhost:5000/api/companies/companies', { headers });
        console.log('✅ Available companies:', companiesResponse.data.companies);
        
        // Get questions for Google
        const googleQuestionsResponse = await axios.get('http://localhost:5000/api/companies/questions/Google?count=3', { headers });
        console.log('✅ Google questions:', googleQuestionsResponse.data.questions.length, 'questions retrieved');
        
        // Get statistics for Microsoft
        const microsoftStatsResponse = await axios.get('http://localhost:5000/api/companies/stats/Microsoft', { headers });
        console.log('✅ Microsoft stats:', microsoftStatsResponse.data.stats);
        console.log('');

        // Test Resume Review API
        console.log('📄 Testing Resume Review API...');
        
        const resumeContent = `
        John Doe
        Software Engineer
        Email: john.doe@email.com
        Phone: (555) 123-4567
        
        Professional Summary:
        Experienced software engineer with 5+ years of experience in full-stack development.
        Proficient in JavaScript, Python, React, and Node.js.
        
        Technical Skills:
        - Programming Languages: JavaScript, Python, Java
        - Frontend: React, HTML5, CSS3
        - Backend: Node.js, Express
        - Databases: MySQL, PostgreSQL
        - Tools: Git, Docker, AWS
        
        Work Experience:
        Senior Software Engineer | Tech Company | 2020-Present
        - Developed web applications serving 100k+ users
        - Led a team of 4 developers
        - Improved performance by 40%
        
        Education:
        Bachelor of Science in Computer Science
        University of Technology | 2014-2018
        `;
        
        const resumeAnalysisResponse = await axios.post('http://localhost:5000/api/analyze-text', {
            resumeContent,
            targetRole: 'Software Engineer',
            experienceLevel: 'Senior-level'
        }, { headers });
        
        console.log('✅ Resume analysis completed');
        console.log('📊 Overall score:', resumeAnalysisResponse.data.analysis.overallScore);
        console.log('💪 Strengths:', resumeAnalysisResponse.data.analysis.strengths.slice(0, 2));
        console.log('🎯 Role match:', resumeAnalysisResponse.data.analysis.roleSpecificFeedback.roleMatch + '%');
        
        // Get resume templates
        const templatesResponse = await axios.get('http://localhost:5000/api/templates', { headers });
        console.log('✅ Resume templates available:', Object.keys(templatesResponse.data.templates));
        console.log('');

        // Test AI Interview API
        console.log('🎤 Testing AI Interview API...');
        
        // Get interview questions
        const questionsResponse = await axios.get('http://localhost:5000/api/questions?role=Software Engineer&difficulty=Medium&count=2', { headers });
        console.log('✅ Interview questions retrieved:', questionsResponse.data.questions.length, 'questions');
        
        // Analyze an interview answer
        const interviewQuestion = "Explain the difference between synchronous and asynchronous programming.";
        const interviewAnswer = `
        Synchronous programming executes code sequentially, where each operation must complete before the next one starts. 
        This can block the execution thread. Asynchronous programming allows operations to run concurrently without blocking 
        the main thread. In JavaScript, we use callbacks, promises, and async/await to handle asynchronous operations. 
        For example, when making API calls, async programming prevents the UI from freezing while waiting for the response.
        `;
        
        const answerAnalysisResponse = await axios.post('http://localhost:5000/api/analyze-answer', {
            question: interviewQuestion,
            answer: interviewAnswer,
            jobRole: 'Software Engineer',
            difficulty: 'Medium'
        }, { headers });
        
        console.log('✅ Interview answer analysis completed');
        console.log('📊 Overall score:', answerAnalysisResponse.data.feedback.overallScore);
        console.log('📈 Category scores:');
        Object.entries(answerAnalysisResponse.data.feedback.categories).forEach(([category, data]) => {
            console.log(`   ${category}: ${data.score}/100`);
        });
        
        // Get interview tips
        const tipsResponse = await axios.get('http://localhost:5000/api/tips?role=Software Engineer', { headers });
        console.log('✅ Interview tips retrieved for Software Engineer role');
        console.log('💡 General preparation tips:', tipsResponse.data.tips.general.preparation.slice(0, 2));
        console.log('');

        // Test legacy endpoints for backward compatibility
        console.log('🔄 Testing legacy endpoints...');
        
        const legacyInterviewResponse = await axios.post('http://localhost:5000/api/ai-interview', {
            question: "What is React?",
            answer: "React is a JavaScript library for building user interfaces."
        });
        console.log('✅ Legacy interview endpoint:', legacyInterviewResponse.data.feedback);
        
        const legacyQuestionsResponse = await axios.get('http://localhost:5000/api/interview-questions/software-engineer');
        console.log('✅ Legacy questions endpoint:', legacyQuestionsResponse.data.questions.length, 'questions');
        
        console.log('\n🎉 All AI-powered APIs are working correctly!');
        console.log('\n📋 Summary of Features:');
        console.log('✅ Company-wise Questions with real data');
        console.log('✅ AI-powered Resume Analysis with role-specific feedback');
        console.log('✅ AI-powered Mock Interview feedback with detailed scoring');
        console.log('✅ Interview questions database with difficulty levels');
        console.log('✅ Resume templates and interview tips');
        console.log('✅ Backward compatibility with existing endpoints');
        
    } catch (error) {
        console.error('❌ Error occurred:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
    }
}

testAIAPIs();

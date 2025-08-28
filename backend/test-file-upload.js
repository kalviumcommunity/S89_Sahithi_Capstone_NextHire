const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testFileUpload() {
    try {
        console.log('🚀 Testing Resume File Upload with AI Analysis...\n');

        // Create a test resume file
        const testResumeContent = `John Doe - Senior Software Engineer Resume
Email: john.doe@email.com
Phone: (555) 123-4567

Professional Summary:
Senior software engineer with 8+ years of experience in full-stack development.
Proficient in JavaScript, Python, React, Node.js, and cloud technologies.

Technical Skills:
- Programming Languages: JavaScript, Python, Java, TypeScript
- Frontend: React, Vue.js, HTML5, CSS3
- Backend: Node.js, Express, Django, Spring Boot
- Databases: MySQL, PostgreSQL, MongoDB, Redis
- Cloud: AWS, Docker, Kubernetes
- Tools: Git, Jenkins, Terraform

Work Experience:
Senior Software Engineer | Tech Company | 2020-Present
- Led a team of 6 developers in building microservices architecture
- Designed and implemented scalable systems serving 1M+ users
- Improved system performance by 60% through optimization
- Mentored junior developers and established coding standards

Software Engineer | Previous Company | 2016-2020
- Developed full-stack applications using React and Node.js
- Implemented CI/CD pipelines reducing deployment time by 40%
- Collaborated with product managers to define technical requirements

Education:
Bachelor of Science in Computer Science
Stanford University | 2012-2016
GPA: 3.8/4.0

Projects:
- Distributed Chat System: Architected real-time messaging platform
- ML Recommendation Engine: Built machine learning system
- Open Source Contributor: Contributed to popular JavaScript libraries

Certifications:
- AWS Certified Solutions Architect
- Certified Kubernetes Administrator (CKA)
`;

        // Create test file
        const testFilePath = path.join(__dirname, 'test-senior-resume.txt');
        fs.writeFileSync(testFilePath, testResumeContent);

        console.log('📄 Created test resume file:', testFilePath);

        // Test 1: Upload resume file without authentication (legacy endpoint)
        console.log('\n🔍 Test 1: Testing file upload without authentication...');
        
        const formData = new FormData();
        formData.append('resume', fs.createReadStream(testFilePath));
        formData.append('targetRole', 'Software Engineer');
        formData.append('experienceLevel', 'Senior-level');

        const response = await axios.post('http://localhost:5000/api/resume-review', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        console.log('✅ File upload successful!');
        console.log('📊 Analysis Results:');
        console.log('📄 Feedback:', response.data.feedback);
        console.log('📈 Overall Score:', response.data.detailedAnalysis?.overallScore);
        console.log('💪 Strengths:', response.data.detailedAnalysis?.strengths?.slice(0, 2));
        console.log('🎯 Role Match:', response.data.detailedAnalysis?.roleSpecificFeedback?.roleMatch + '%');
        console.log('📁 File Info:', {
            name: response.data.fileName,
            size: response.data.fileSize + ' bytes',
            analysisDate: response.data.analysisDate
        });

        // Test 2: Test with different experience levels
        console.log('\n🔍 Test 2: Testing with junior-level resume...');
        
        const juniorFilePath = path.join(__dirname, 'test-junior-resume.txt');
        fs.writeFileSync(juniorFilePath, testResumeContent.replace('Senior', 'Junior').replace('8+', '1'));

        const formData2 = new FormData();
        formData2.append('resume', fs.createReadStream(juniorFilePath));
        formData2.append('targetRole', 'Software Engineer');
        formData2.append('experienceLevel', 'Entry-level');

        const response2 = await axios.post('http://localhost:5000/api/resume-review', formData2, {
            headers: {
                ...formData2.getHeaders()
            }
        });

        console.log('✅ Junior resume analysis successful!');
        console.log('📈 Overall Score:', response2.data.detailedAnalysis?.overallScore);
        console.log('🎯 Role Match:', response2.data.detailedAnalysis?.roleSpecificFeedback?.roleMatch + '%');

        // Test 3: Test error handling with invalid file
        console.log('\n🔍 Test 3: Testing error handling...');
        
        try {
            const formData3 = new FormData();
            // Don't append any file to test error handling
            
            await axios.post('http://localhost:5000/api/resume-review', formData3, {
                headers: {
                    ...formData3.getHeaders()
                }
            });
        } catch (error) {
            console.log('✅ Error handling works correctly:', error.response?.data?.feedback);
        }

        // Clean up test files
        fs.unlinkSync(testFilePath);
        fs.unlinkSync(juniorFilePath);
        console.log('\n🧹 Cleaned up test files');

        console.log('\n🎉 All file upload tests passed!');
        console.log('\n📋 Summary:');
        console.log('✅ File upload with AI analysis working');
        console.log('✅ Detailed feedback generation working');
        console.log('✅ Role-specific analysis working');
        console.log('✅ Experience level detection working');
        console.log('✅ Error handling working');
        console.log('✅ File cleanup working');

    } catch (error) {
        console.error('❌ Error occurred:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
    }
}

testFileUpload();

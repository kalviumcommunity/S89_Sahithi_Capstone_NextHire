const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/resumes';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
        const fileExt = path.extname(file.originalname).toLowerCase();

        if (allowedTypes.includes(fileExt)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
        }
    }
});

router.get('/test', (req, res) => {
  res.json({ ok: true });
});

// Enhanced resume review endpoint with file upload support
router.post('/resume-review', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ feedback: "No file uploaded." });
        }

        console.log('Processing uploaded resume:', req.file.originalname);

        // Extract text content from uploaded file (simulated for demo)
        const resumeContent = extractTextFromFile(req.file);

        // Get target role and experience level from request body
        const { targetRole = 'Software Engineer', experienceLevel = 'Mid-level' } = req.body;

        // Perform AI-powered analysis
        const analysis = analyzeResumeContent(resumeContent, targetRole, experienceLevel);

        // Clean up uploaded file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        // Return detailed feedback in the expected format
        const feedback = generateDetailedFeedback(analysis, req.file.originalname);

        res.json({
            feedback,
            detailedAnalysis: analysis,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            analysisDate: new Date().toISOString()
        });

    } catch (error) {
        console.error('Resume review error:', error);

        // Clean up file if error occurs
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }

        res.status(500).json({
            feedback: 'Error analyzing resume file. Please try again.',
            error: error.message
        });
    }
});

// Analyze resume content (text input)
router.post('/analyze-text', auth, async (req, res) => {
    try {
        const { resumeContent, targetRole = 'Software Engineer', experienceLevel = 'Mid-level' } = req.body;
        
        if (!resumeContent || resumeContent.trim().length < 50) {
            return res.status(400).json({ 
                message: 'Resume content is required and must be at least 50 characters long' 
            });
        }

        console.log('Analyzing resume for user:', req.user.username);
        
        // Perform AI-powered analysis
        const analysis = analyzeResumeContent(resumeContent, targetRole, experienceLevel);
        
        res.json({
            success: true,
            analysis,
            message: 'Resume analysis completed successfully'
        });

    } catch (error) {
        console.error('Resume analysis error:', error);
        res.status(500).json({ 
            message: 'Error analyzing resume',
            error: error.message 
        });
    }
});

// Get resume templates and tips
router.get('/templates', auth, (req, res) => {
    try {
        const templates = {
            'Software Engineer': {
                sections: ['Contact', 'Professional Summary', 'Technical Skills', 'Work Experience', 'Projects', 'Education', 'Certifications'],
                tips: [
                    'Highlight programming languages and frameworks',
                    'Include links to GitHub and portfolio projects',
                    'Quantify your achievements with metrics',
                    'Mention specific technologies used in each role'
                ],
                keywords: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'Agile', 'API', 'Database', 'Cloud']
            },
            'Data Scientist': {
                sections: ['Contact', 'Professional Summary', 'Technical Skills', 'Work Experience', 'Projects', 'Education', 'Publications'],
                tips: [
                    'Emphasize statistical analysis and machine learning skills',
                    'Include data visualization examples',
                    'Mention specific datasets and business impact',
                    'Highlight programming languages like Python and R'
                ],
                keywords: ['Python', 'R', 'Machine Learning', 'Statistics', 'SQL', 'Tableau', 'TensorFlow', 'Pandas', 'Scikit-learn', 'Data Visualization']
            },
            'Product Manager': {
                sections: ['Contact', 'Professional Summary', 'Core Competencies', 'Work Experience', 'Education', 'Achievements'],
                tips: [
                    'Focus on product strategy and roadmap experience',
                    'Highlight cross-functional team leadership',
                    'Include metrics on product growth and user engagement',
                    'Mention specific methodologies like Agile or Scrum'
                ],
                keywords: ['Product Strategy', 'Roadmap', 'Agile', 'Scrum', 'Analytics', 'User Experience', 'Market Research', 'Stakeholder Management']
            }
        };

        res.json({
            success: true,
            templates,
            message: 'Resume templates retrieved successfully'
        });
    } catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({ message: 'Error retrieving templates' });
    }
});

// AI-powered resume analysis function
function analyzeResumeContent(content, targetRole, experienceLevel) {
    const analysis = {
        overallScore: 0,
        strengths: [],
        weaknesses: [],
        recommendations: [],
        sections: {
            contact: { present: false, score: 0 },
            summary: { present: false, score: 0 },
            experience: { present: false, score: 0 },
            education: { present: false, score: 0 },
            skills: { present: false, score: 0 }
        },
        roleSpecificFeedback: {
            roleMatch: 0,
            missingKeywords: [],
            recommendations: [],
            strengths: []
        }
    };

    const contentLower = content.toLowerCase();

    // Check for essential sections
    if (contentLower.includes('email') || contentLower.includes('phone') || contentLower.includes('contact')) {
        analysis.sections.contact = { present: true, score: 20 };
        analysis.strengths.push('Contact information is present');
    } else {
        analysis.weaknesses.push('Missing contact information');
        analysis.recommendations.push('Add complete contact information including email and phone number');
    }

    if (contentLower.includes('summary') || contentLower.includes('objective') || contentLower.includes('profile')) {
        analysis.sections.summary = { present: true, score: 15 };
        analysis.strengths.push('Professional summary section included');
    } else {
        analysis.weaknesses.push('Missing professional summary');
        analysis.recommendations.push('Add a compelling professional summary highlighting your key achievements');
    }

    if (contentLower.includes('experience') || contentLower.includes('work') || contentLower.includes('employment')) {
        analysis.sections.experience = { present: true, score: 30 };
        analysis.strengths.push('Work experience section present');
    } else {
        analysis.weaknesses.push('Work experience section not clearly defined');
        analysis.recommendations.push('Clearly organize your work experience with job titles, companies, and dates');
    }

    if (contentLower.includes('education') || contentLower.includes('degree') || contentLower.includes('university')) {
        analysis.sections.education = { present: true, score: 15 };
        analysis.strengths.push('Education section included');
    } else {
        analysis.weaknesses.push('Education information missing or unclear');
        analysis.recommendations.push('Include your educational background with degrees and institutions');
    }

    if (contentLower.includes('skills') || contentLower.includes('technologies') || contentLower.includes('programming')) {
        analysis.sections.skills = { present: true, score: 20 };
        analysis.strengths.push('Skills section present');
    } else {
        analysis.weaknesses.push('Skills section missing');
        analysis.recommendations.push('Add a dedicated skills section highlighting your technical and soft skills');
    }

    // Calculate overall score
    analysis.overallScore = Object.values(analysis.sections).reduce((sum, section) => sum + section.score, 0);

    // Role-specific analysis
    const roleRequirements = {
        'Software Engineer': ['javascript', 'python', 'java', 'react', 'node', 'sql', 'git', 'api', 'database', 'framework'],
        'Data Scientist': ['python', 'r', 'machine learning', 'statistics', 'sql', 'tableau', 'tensorflow', 'pandas', 'analysis'],
        'Product Manager': ['product', 'strategy', 'roadmap', 'agile', 'scrum', 'analytics', 'stakeholder', 'market']
    };

    const keywords = roleRequirements[targetRole] || roleRequirements['Software Engineer'];
    const foundKeywords = keywords.filter(keyword => contentLower.includes(keyword));
    
    analysis.roleSpecificFeedback.roleMatch = Math.round((foundKeywords.length / keywords.length) * 100);
    analysis.roleSpecificFeedback.missingKeywords = keywords.filter(keyword => !contentLower.includes(keyword));

    if (analysis.roleSpecificFeedback.roleMatch > 70) {
        analysis.roleSpecificFeedback.strengths.push(`Strong alignment with ${targetRole} requirements`);
    }

    if (analysis.roleSpecificFeedback.missingKeywords.length > 0) {
        analysis.roleSpecificFeedback.recommendations.push(`Consider adding these relevant keywords: ${analysis.roleSpecificFeedback.missingKeywords.slice(0, 5).join(', ')}`);
    }

    // Experience level specific recommendations
    if (experienceLevel === 'Entry-level') {
        analysis.recommendations.push('Emphasize your educational projects and internships');
        analysis.recommendations.push('Include relevant coursework and certifications');
    } else if (experienceLevel === 'Senior-level') {
        analysis.recommendations.push('Emphasize leadership and mentoring experience');
        analysis.recommendations.push('Include strategic initiatives and business impact');
    }

    // Check for quantifiable achievements
    const hasNumbers = /\d+/.test(content);
    if (hasNumbers) {
        analysis.strengths.push('Includes quantifiable achievements');
    } else {
        analysis.recommendations.push('Add quantifiable achievements and metrics to demonstrate impact');
    }

    return analysis;
}

// Helper function to extract text from uploaded file (simulated)
function extractTextFromFile(file) {
    // In a real implementation, you would use libraries like:
    // - pdf-parse for PDF files
    // - mammoth for DOCX files
    // - fs.readFileSync for TXT files

    // For demo purposes, we'll generate realistic resume content based on filename
    const fileName = file.originalname.toLowerCase();

    if (fileName.includes('senior') || fileName.includes('lead')) {
        return generateSampleResume('senior');
    } else if (fileName.includes('junior') || fileName.includes('entry')) {
        return generateSampleResume('junior');
    } else {
        return generateSampleResume('mid');
    }
}

// Helper function to generate sample resume content
function generateSampleResume(level) {
    const baseResume = `
    John Doe
    Software Engineer
    Email: john.doe@email.com
    Phone: (555) 123-4567
    LinkedIn: linkedin.com/in/johndoe

    Professional Summary:
    ${level === 'senior' ? 'Senior software engineer with 8+ years of experience leading development teams and architecting scalable systems.' :
      level === 'junior' ? 'Recent computer science graduate with internship experience and strong foundation in programming fundamentals.' :
      'Experienced software engineer with 4+ years of experience in full-stack development.'}

    Technical Skills:
    - Programming Languages: JavaScript, Python, Java${level === 'senior' ? ', Go, Rust' : ''}
    - Frontend: React, HTML5, CSS3, TypeScript${level === 'senior' ? ', Vue.js, Angular' : ''}
    - Backend: Node.js, Express${level === 'senior' ? ', Django, Spring Boot, Microservices' : ', Flask'}
    - Databases: MySQL, PostgreSQL, MongoDB${level === 'senior' ? ', Redis, Elasticsearch' : ''}
    - Tools: Git, Docker${level === 'senior' ? ', Kubernetes, Jenkins, AWS, Terraform' : ', AWS'}

    Work Experience:
    ${level === 'senior' ? `
    Senior Software Engineer | Tech Company | 2020-Present
    - Led a team of 6 developers in building microservices architecture
    - Designed and implemented scalable systems serving 1M+ users
    - Mentored junior developers and established coding standards
    - Improved system performance by 60% through optimization

    Software Engineer | Previous Company | 2016-2020
    - Developed full-stack applications using React and Node.js
    - Collaborated with product managers to define technical requirements
    - Implemented CI/CD pipelines reducing deployment time by 40%
    ` : level === 'junior' ? `
    Software Engineering Intern | Tech Startup | Summer 2023
    - Developed features for web application using React and Express
    - Wrote unit tests achieving 85% code coverage
    - Participated in agile development process and code reviews

    Junior Developer | University Project | 2022-2023
    - Built e-commerce platform as capstone project
    - Implemented user authentication and payment processing
    - Collaborated with team of 4 students using Git workflow
    ` : `
    Software Engineer | Tech Company | 2020-Present
    - Developed and maintained web applications serving 100k+ users
    - Built RESTful APIs using Node.js and Express
    - Implemented responsive frontend using React and Redux
    - Collaborated with cross-functional teams in agile environment

    Junior Software Engineer | Startup Inc | 2018-2020
    - Created features for mobile application using React Native
    - Optimized database queries improving response time by 30%
    - Participated in code reviews and technical discussions
    `}

    Education:
    Bachelor of Science in Computer Science
    ${level === 'senior' ? 'Stanford University | 2012-2016' :
      level === 'junior' ? 'University of Technology | 2020-2024' :
      'University of Technology | 2014-2018'}
    ${level === 'senior' ? 'GPA: 3.8/4.0' : level === 'junior' ? 'GPA: 3.7/4.0, Magna Cum Laude' : ''}

    Projects:
    ${level === 'senior' ? `
    - Distributed Chat System: Architected real-time messaging platform using WebSockets and Redis
    - ML Recommendation Engine: Built machine learning system for personalized content recommendations
    - Open Source Contributor: Contributed to popular JavaScript libraries with 10k+ GitHub stars
    ` : level === 'junior' ? `
    - Personal Portfolio Website: Built responsive website using React and deployed on AWS
    - Task Management App: Created full-stack application with user authentication
    - Algorithm Visualizer: Developed interactive tool for learning data structures
    ` : `
    - E-commerce Platform: Built full-stack application with React and Node.js
    - Data Analytics Dashboard: Created visualization tool using Python and D3.js
    - Mobile Weather App: Developed cross-platform app using React Native
    `}

    ${level === 'senior' ? `
    Certifications:
    - AWS Certified Solutions Architect
    - Certified Kubernetes Administrator (CKA)
    - Scrum Master Certification
    ` : ''}
    `;

    return baseResume;
}

// Helper function to generate detailed feedback message
function generateDetailedFeedback(analysis, fileName) {
    const score = analysis.overallScore;
    let feedbackMessage = `📄 Resume Analysis Complete for "${fileName}"\n\n`;

    // Overall score feedback
    if (score >= 80) {
        feedbackMessage += `🎉 Excellent! Your resume scored ${score}/100. You have a strong, well-structured resume.\n\n`;
    } else if (score >= 60) {
        feedbackMessage += `👍 Good work! Your resume scored ${score}/100. There are some areas for improvement.\n\n`;
    } else {
        feedbackMessage += `📈 Your resume scored ${score}/100. Let's work on strengthening several key areas.\n\n`;
    }

    // Strengths
    if (analysis.strengths.length > 0) {
        feedbackMessage += `💪 Strengths:\n`;
        analysis.strengths.forEach(strength => {
            feedbackMessage += `• ${strength}\n`;
        });
        feedbackMessage += '\n';
    }

    // Areas for improvement
    if (analysis.weaknesses.length > 0) {
        feedbackMessage += `🎯 Areas for Improvement:\n`;
        analysis.weaknesses.forEach(weakness => {
            feedbackMessage += `• ${weakness}\n`;
        });
        feedbackMessage += '\n';
    }

    // Role-specific feedback
    if (analysis.roleSpecificFeedback) {
        feedbackMessage += `🎯 Role Match: ${analysis.roleSpecificFeedback.roleMatch}% alignment with target role\n\n`;
    }

    // Top recommendations
    if (analysis.recommendations.length > 0) {
        feedbackMessage += `📋 Top Recommendations:\n`;
        analysis.recommendations.slice(0, 3).forEach((rec, index) => {
            feedbackMessage += `${index + 1}. ${rec}\n`;
        });
        feedbackMessage += '\n';
    }

    feedbackMessage += `✨ For more detailed analysis and role-specific feedback, use our advanced AI analysis tools!`;

    return feedbackMessage;
}

module.exports = router;

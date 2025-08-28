const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/videos';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        // Handle different file types
        let extension = path.extname(file.originalname).toLowerCase();

        // If no extension or it's a blob, determine extension from MIME type
        if (!extension || file.originalname === 'blob') {
            if (file.mimetype === 'video/mp4') {
                extension = '.mp4';
            } else if (file.mimetype === 'video/webm') {
                extension = '.webm';
            } else if (file.mimetype === 'video/quicktime') {
                extension = '.mov';
            } else if (file.mimetype === 'video/x-msvideo') {
                extension = '.avi';
            } else {
                extension = '.mp4'; // Default to mp4 for unknown video types
            }
        }

        cb(null, `interview-${uniqueSuffix}${extension}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit for videos
    },
    fileFilter: (req, file, cb) => {
        console.log('File upload details:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            fieldname: file.fieldname
        });

        // Allow video files by extension
        const allowedExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.webm'];
        const fileExt = path.extname(file.originalname).toLowerCase();

        // Allow video files by MIME type (for recorded videos)
        const allowedMimeTypes = [
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'video/x-msvideo',
            'video/x-ms-wmv',
            'application/octet-stream' // For blob uploads
        ];

        // Check if it's a valid video file by extension or MIME type
        const isValidExtension = allowedExtensions.includes(fileExt);
        const isValidMimeType = allowedMimeTypes.includes(file.mimetype);

        // Special handling for recorded videos (often come as blobs without proper extensions)
        const isRecordedVideo = file.originalname === 'blob' ||
                               file.originalname.startsWith('recorded-') ||
                               file.fieldname === 'video' && file.mimetype.startsWith('video/');

        if (isValidExtension || isValidMimeType || isRecordedVideo) {
            cb(null, true);
        } else {
            console.log('File rejected:', {
                extension: fileExt,
                mimetype: file.mimetype,
                originalname: file.originalname
            });
            cb(new Error('Invalid file type. Please upload a video file (MP4, AVI, MOV, WMV, WEBM) or use the video recorder.'));
        }
    }
});

router.get('/test', (req, res) => {
  res.json({ ok: true });
});

// Legacy endpoint for backward compatibility
router.post('/ai-interview', (req, res) => {
  const { question, answer } = req.body;
  
  if (!question || !answer) {
    return res.status(400).json({ feedback: "Question and answer are required." });
  }
  
  // Provide basic feedback for non-authenticated users
  const feedback = "Your answer has been received. For detailed AI-powered feedback, please use the /analyze-answer endpoint with authentication.";
  res.json({ feedback });
});

// Analyze interview answer with AI
router.post('/analyze-answer', auth, async (req, res) => {
    try {
        const { question, answer, jobRole = 'Software Engineer', difficulty = 'Medium' } = req.body;
        
        if (!question || !answer) {
            return res.status(400).json({ 
                message: 'Question and answer are required' 
            });
        }

        if (answer.trim().length < 10) {
            return res.status(400).json({ 
                message: 'Answer must be at least 10 characters long' 
            });
        }

        console.log('Analyzing interview answer for user:', req.user.username);
        
        // Get AI-powered feedback
        const feedback = analyzeInterviewAnswer(question, answer, jobRole);
        
        // Add additional context
        const enhancedFeedback = {
            ...feedback,
            question,
            answer,
            jobRole,
            difficulty,
            analysisDate: new Date().toISOString(),
            userId: req.user._id,
            improvementSuggestions: generateImprovementSuggestions(feedback, jobRole)
        };

        res.json({
            success: true,
            feedback: enhancedFeedback,
            message: 'Interview answer analysis completed successfully'
        });

    } catch (error) {
        console.error('Interview analysis error:', error);
        res.status(500).json({ 
            message: 'Error analyzing interview answer',
            error: error.message 
        });
    }
});

// Get interview questions by role and difficulty
router.get('/questions', auth, (req, res) => {
    try {
        const { role = 'Software Engineer', difficulty = 'Medium', count = 5 } = req.query;
        
        const questionBank = getInterviewQuestions();
        let questions = questionBank[role] || questionBank['Software Engineer'];
        
        // Filter by difficulty
        if (difficulty !== 'All') {
            questions = questions.filter(q => q.difficulty === difficulty);
        }
        
        // Shuffle and limit
        const shuffled = questions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, parseInt(count));
        
        res.json({
            success: true,
            questions: selectedQuestions,
            role,
            difficulty,
            totalAvailable: questions.length,
            message: 'Interview questions retrieved successfully'
        });
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ message: 'Error retrieving questions' });
    }
});

// Get interview tips and best practices
router.get('/tips', auth, (req, res) => {
    try {
        const { role = 'Software Engineer' } = req.query;
        
        const tips = getInterviewTips(role);
        
        res.json({
            success: true,
            tips,
            role,
            message: 'Interview tips retrieved successfully'
        });
    } catch (error) {
        console.error('Get tips error:', error);
        res.status(500).json({ message: 'Error retrieving tips' });
    }
});

// Video interview analysis endpoint (handles both file uploads and recorded videos)
router.post('/interview-analyze', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            console.log('No file received in request');
            return res.status(400).json({
                feedback: 'No video uploaded. Please select a video file or record a new video.',
                score: null
            });
        }

        console.log('Processing uploaded video:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            fieldname: req.file.fieldname,
            filename: req.file.filename
        });

        // Get question and other parameters from request body
        const {
            question = 'Tell me about yourself',
            jobRole = 'Software Engineer',
            difficulty = 'Medium'
        } = req.body;

        // Simulate video analysis (in real implementation, you would use video processing libraries)
        const videoAnalysis = analyzeVideoInterview(req.file, question, jobRole);

        // Clean up uploaded video file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting video file:', err);
        });

        // Return detailed feedback in the expected format
        res.json({
            feedback: videoAnalysis.feedback,
            score: videoAnalysis.score,
            detailedAnalysis: videoAnalysis.detailedAnalysis,
            videoInfo: {
                fileName: req.file.originalname,
                fileSize: req.file.size,
                duration: videoAnalysis.estimatedDuration,
                analysisDate: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Video analysis error:', error);

        // Clean up file if error occurs
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting video file:', err);
            });
        }

        res.status(500).json({
            feedback: 'Error uploading video. Please try again.',
            score: null,
            error: error.message
        });
    }
});

// Legacy endpoint for getting questions by role
router.get('/interview-questions/:role', (req, res) => {
    try {
        const role = req.params.role;
        const questionBank = getInterviewQuestions();
        
        // Convert role format
        const roleMap = {
            'software-engineer': 'Software Engineer',
            'data-scientist': 'Data Scientist',
            'product-manager': 'Product Manager'
        };
        
        const mappedRole = roleMap[role] || 'Software Engineer';
        const questions = questionBank[mappedRole] || [];
        
        // Get random questions
        const shuffled = questions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, 3).map(q => q.question);
        
        res.json({ questions: selectedQuestions });
    } catch (error) {
        console.error('Get legacy questions error:', error);
        res.status(500).json({ questions: [] });
    }
});

// AI-powered interview answer analysis
function analyzeInterviewAnswer(question, answer, jobRole) {
    const analysis = {
        overallScore: 0,
        strengths: [],
        weaknesses: [],
        recommendations: [],
        categories: {
            relevance: { score: 0, feedback: '' },
            technical: { score: 0, feedback: '' },
            communication: { score: 0, feedback: '' },
            completeness: { score: 0, feedback: '' }
        }
    };

    const answerLower = answer.toLowerCase();
    const questionLower = question.toLowerCase();

    // Analyze relevance
    const questionKeywords = questionLower.split(' ').filter(word => word.length > 3);
    const relevantKeywords = questionKeywords.filter(keyword => answerLower.includes(keyword));
    const relevanceScore = Math.min((relevantKeywords.length / questionKeywords.length) * 100, 100);
    
    analysis.categories.relevance.score = relevanceScore;
    if (relevanceScore > 70) {
        analysis.categories.relevance.feedback = 'Answer is highly relevant to the question';
        analysis.strengths.push('Directly addressed the question');
    } else if (relevanceScore > 40) {
        analysis.categories.relevance.feedback = 'Answer is somewhat relevant but could be more focused';
        analysis.recommendations.push('Focus more directly on what the question is asking');
    } else {
        analysis.categories.relevance.feedback = 'Answer lacks relevance to the question';
        analysis.weaknesses.push('Did not directly address the question');
        analysis.recommendations.push('Make sure to understand and directly answer what is being asked');
    }

    // Analyze technical content
    const techTerms = ['algorithm', 'data structure', 'complexity', 'design pattern', 'architecture', 'database', 'api', 'framework'];
    const foundTechTerms = techTerms.filter(term => answerLower.includes(term));
    const technicalScore = Math.min((foundTechTerms.length / 3) * 100, 100);
    
    analysis.categories.technical.score = technicalScore;
    if (technicalScore > 60) {
        analysis.categories.technical.feedback = 'Good use of technical terminology';
        analysis.strengths.push('Demonstrated technical knowledge');
    } else {
        analysis.categories.technical.feedback = 'Could include more technical details';
        analysis.recommendations.push('Include more specific technical concepts and terminology');
    }

    // Analyze communication
    const wordCount = answer.split(' ').length;
    const sentenceCount = answer.split(/[.!?]+/).length;
    const avgWordsPerSentence = wordCount / sentenceCount;
    
    let communicationScore = 50;
    if (wordCount > 50 && wordCount < 200 && avgWordsPerSentence > 8 && avgWordsPerSentence < 25) {
        communicationScore = 85;
        analysis.categories.communication.feedback = 'Well-structured and clear communication';
        analysis.strengths.push('Clear and concise communication');
    } else if (wordCount < 30) {
        communicationScore = 30;
        analysis.categories.communication.feedback = 'Answer is too brief';
        analysis.weaknesses.push('Answer lacks detail');
        analysis.recommendations.push('Provide more detailed explanations with examples');
    } else if (wordCount > 300) {
        communicationScore = 40;
        analysis.categories.communication.feedback = 'Answer is too lengthy';
        analysis.recommendations.push('Be more concise while maintaining key points');
    }
    
    analysis.categories.communication.score = communicationScore;

    // Analyze completeness
    const hasExample = answerLower.includes('example') || answerLower.includes('instance') || answerLower.includes('like');
    const hasExperience = answerLower.includes('experience') || answerLower.includes('worked') || answerLower.includes('project');
    
    let completenessScore = 40;
    if (hasExample && hasExperience) {
        completenessScore = 90;
        analysis.categories.completeness.feedback = 'Complete answer with examples and experience';
        analysis.strengths.push('Provided concrete examples from experience');
    } else if (hasExample || hasExperience) {
        completenessScore = 70;
        analysis.categories.completeness.feedback = 'Good answer but could include more examples';
        analysis.recommendations.push('Include specific examples from your experience');
    } else {
        analysis.categories.completeness.feedback = 'Answer lacks concrete examples';
        analysis.weaknesses.push('No specific examples provided');
        analysis.recommendations.push('Always support your answers with specific examples from your experience');
    }
    
    analysis.categories.completeness.score = completenessScore;

    // Calculate overall score
    analysis.overallScore = Math.round(
        (analysis.categories.relevance.score * 0.3 +
         analysis.categories.technical.score * 0.25 +
         analysis.categories.communication.score * 0.25 +
         analysis.categories.completeness.score * 0.2)
    );

    return analysis;
}

// Helper function to generate improvement suggestions
function generateImprovementSuggestions(feedback, jobRole) {
    const suggestions = [];
    
    if (feedback.overallScore < 50) {
        suggestions.push('Focus on understanding the core concepts before attempting to answer');
        suggestions.push('Practice explaining technical concepts in simple terms');
    } else if (feedback.overallScore < 70) {
        suggestions.push('Add more specific examples from your experience');
        suggestions.push('Structure your answers with clear beginning, middle, and end');
    } else {
        suggestions.push('Great job! Continue practicing to maintain consistency');
        suggestions.push('Consider adding more technical depth to your answers');
    }
    
    // Role-specific suggestions
    if (jobRole === 'Software Engineer') {
        suggestions.push('Include code examples or pseudocode when relevant');
        suggestions.push('Discuss time and space complexity for algorithmic questions');
    } else if (jobRole === 'Data Scientist') {
        suggestions.push('Mention specific tools and libraries you would use');
        suggestions.push('Discuss data validation and model evaluation techniques');
    } else if (jobRole === 'Product Manager') {
        suggestions.push('Include metrics and KPIs in your answers');
        suggestions.push('Discuss stakeholder management and prioritization');
    }
    
    return suggestions;
}

// Helper function to get interview questions
function getInterviewQuestions() {
    return {
        'Software Engineer': [
            {
                id: 1,
                question: "Explain the difference between synchronous and asynchronous programming.",
                difficulty: "Medium",
                category: "Programming Concepts",
                expectedPoints: ["Blocking vs non-blocking", "Event loop", "Callbacks/Promises", "Use cases"]
            },
            {
                id: 2,
                question: "How would you optimize a slow database query?",
                difficulty: "Hard",
                category: "Database",
                expectedPoints: ["Indexing", "Query analysis", "Database design", "Caching"]
            },
            {
                id: 3,
                question: "What is the difference between REST and GraphQL?",
                difficulty: "Medium",
                category: "API Design",
                expectedPoints: ["Multiple endpoints vs single endpoint", "Over-fetching", "Type system", "Caching"]
            },
            {
                id: 4,
                question: "Explain object-oriented programming principles.",
                difficulty: "Easy",
                category: "OOP",
                expectedPoints: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"]
            },
            {
                id: 5,
                question: "How would you design a URL shortener like bit.ly?",
                difficulty: "Hard",
                category: "System Design",
                expectedPoints: ["Database design", "Encoding algorithm", "Caching", "Scalability"]
            }
        ]
    };
}

// Helper function to get interview tips
function getInterviewTips(role) {
    return {
        general: {
            preparation: [
                "Research the company and role thoroughly",
                "Practice common interview questions",
                "Prepare specific examples from your experience",
                "Review your resume and be ready to discuss any point"
            ],
            during: [
                "Listen carefully to the question",
                "Take a moment to think before answering",
                "Use the STAR method (Situation, Task, Action, Result)",
                "Ask clarifying questions if needed"
            ]
        },
        roleSpecific: {
            technical: [
                "Be ready to code on a whiteboard or computer",
                "Explain your thought process while solving problems",
                "Discuss time and space complexity",
                "Know your data structures and algorithms"
            ]
        }
    };
}

// AI-powered video interview analysis
function analyzeVideoInterview(videoFile, question, jobRole) {
    // Simulate video analysis based on file properties
    const fileSizeKB = videoFile.size / 1024;
    const estimatedDuration = Math.max(30, Math.min(300, fileSizeKB / 100)); // Estimate 30s to 5min based on file size

    // Base analysis scores
    let videoQualityScore = 75;
    let audioQualityScore = 80;
    let contentScore = 70;
    let confidenceScore = 65;
    let eyeContactScore = 70;

    // Adjust scores based on file size (larger files typically mean better quality)
    if (fileSizeKB > 10000) { // > 10MB
        videoQualityScore += 15;
        audioQualityScore += 10;
    } else if (fileSizeKB < 2000) { // < 2MB
        videoQualityScore -= 10;
        audioQualityScore -= 15;
    }

    // Adjust scores based on estimated duration
    if (estimatedDuration < 60) {
        contentScore -= 20; // Too short
    } else if (estimatedDuration > 180) {
        contentScore -= 10; // Too long
    } else {
        contentScore += 10; // Good duration
    }

    // Simulate confidence analysis based on filename patterns
    const fileName = videoFile.originalname.toLowerCase();
    if (fileName.includes('confident') || fileName.includes('good') || fileName.includes('best')) {
        confidenceScore += 15;
        eyeContactScore += 10;
    } else if (fileName.includes('nervous') || fileName.includes('bad') || fileName.includes('test')) {
        confidenceScore -= 10;
        eyeContactScore -= 5;
    }

    // Calculate overall score
    const overallScore = Math.round(
        (videoQualityScore * 0.15 +
         audioQualityScore * 0.15 +
         contentScore * 0.35 +
         confidenceScore * 0.20 +
         eyeContactScore * 0.15)
    );

    // Generate feedback based on scores
    const strengths = [];
    const weaknesses = [];
    const recommendations = [];

    if (videoQualityScore > 80) {
        strengths.push('Excellent video quality and lighting');
    } else if (videoQualityScore < 60) {
        weaknesses.push('Video quality could be improved');
        recommendations.push('Ensure good lighting and camera positioning');
    }

    if (audioQualityScore > 80) {
        strengths.push('Clear audio quality');
    } else if (audioQualityScore < 60) {
        weaknesses.push('Audio quality needs improvement');
        recommendations.push('Use a good microphone and quiet environment');
    }

    if (contentScore > 80) {
        strengths.push('Well-structured and comprehensive answer');
    } else if (contentScore < 60) {
        weaknesses.push('Answer lacks depth or structure');
        recommendations.push('Provide more detailed examples and structure your response');
    }

    if (confidenceScore > 80) {
        strengths.push('Confident and professional demeanor');
    } else if (confidenceScore < 60) {
        weaknesses.push('Could appear more confident');
        recommendations.push('Practice speaking clearly and maintain good posture');
    }

    if (eyeContactScore > 80) {
        strengths.push('Good eye contact with camera');
    } else if (eyeContactScore < 60) {
        weaknesses.push('Limited eye contact with camera');
        recommendations.push('Look directly at the camera lens while speaking');
    }

    // Generate detailed feedback message
    let feedbackMessage = `🎥 Video Interview Analysis Complete\n\n`;

    if (overallScore >= 80) {
        feedbackMessage += `🎉 Excellent performance! You scored ${overallScore}/100.\n\n`;
    } else if (overallScore >= 60) {
        feedbackMessage += `👍 Good job! You scored ${overallScore}/100. There are areas for improvement.\n\n`;
    } else {
        feedbackMessage += `📈 You scored ${overallScore}/100. Let's work on improving your interview skills.\n\n`;
    }

    if (strengths.length > 0) {
        feedbackMessage += `💪 Strengths:\n`;
        strengths.forEach(strength => {
            feedbackMessage += `• ${strength}\n`;
        });
        feedbackMessage += '\n';
    }

    if (weaknesses.length > 0) {
        feedbackMessage += `🎯 Areas for Improvement:\n`;
        weaknesses.forEach(weakness => {
            feedbackMessage += `• ${weakness}\n`;
        });
        feedbackMessage += '\n';
    }

    if (recommendations.length > 0) {
        feedbackMessage += `📋 Recommendations:\n`;
        recommendations.forEach((rec, index) => {
            feedbackMessage += `${index + 1}. ${rec}\n`;
        });
        feedbackMessage += '\n';
    }

    feedbackMessage += `⏱️ Estimated Duration: ${Math.round(estimatedDuration)}s\n`;
    feedbackMessage += `📊 Technical Quality: Video ${videoQualityScore}/100, Audio ${audioQualityScore}/100\n\n`;
    feedbackMessage += `✨ Keep practicing to improve your interview performance!`;

    return {
        feedback: feedbackMessage,
        score: overallScore,
        estimatedDuration: Math.round(estimatedDuration),
        detailedAnalysis: {
            overallScore,
            categories: {
                videoQuality: { score: videoQualityScore, feedback: videoQualityScore > 70 ? 'Good video quality' : 'Video quality needs improvement' },
                audioQuality: { score: audioQualityScore, feedback: audioQualityScore > 70 ? 'Clear audio' : 'Audio quality could be better' },
                content: { score: contentScore, feedback: contentScore > 70 ? 'Well-structured answer' : 'Answer could be more detailed' },
                confidence: { score: confidenceScore, feedback: confidenceScore > 70 ? 'Confident presentation' : 'Could appear more confident' },
                eyeContact: { score: eyeContactScore, feedback: eyeContactScore > 70 ? 'Good eye contact' : 'Maintain better eye contact' }
            },
            strengths,
            weaknesses,
            recommendations,
            technicalMetrics: {
                fileSizeKB: Math.round(fileSizeKB),
                estimatedDuration: Math.round(estimatedDuration),
                videoQuality: videoQualityScore,
                audioQuality: audioQualityScore
            }
        }
    };
}

module.exports = router;

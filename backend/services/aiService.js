const axios = require('axios');

class AIService {
    constructor() {
        // Using Hugging Face API as a free alternative to OpenAI
        this.apiKey = process.env.HUGGINGFACE_API_KEY || 'hf_demo_key';
        this.baseURL = 'https://api-inference.huggingface.co/models';
        this.textModel = 'microsoft/DialoGPT-large';
        this.analysisModel = 'facebook/bart-large-mnli';
    }

    async generateText(prompt, maxLength = 500) {
        try {
            const response = await axios.post(
                `${this.baseURL}/${this.textModel}`,
                {
                    inputs: prompt,
                    parameters: {
                        max_length: maxLength,
                        temperature: 0.7,
                        do_sample: true,
                        top_p: 0.9
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data[0]?.generated_text || this.getFallbackResponse(prompt);
        } catch (error) {
            console.error('AI Service Error:', error.message);
            return this.getFallbackResponse(prompt);
        }
    }

    async analyzeResume(resumeContent) {
        try {
            const prompt = `Analyze this resume and provide detailed feedback:

Resume Content:
${resumeContent}

Please provide feedback on:
1. Overall structure and formatting
2. Skills and experience relevance
3. Areas for improvement
4. Strengths and weaknesses
5. Specific recommendations

Feedback:`;

            // For demo purposes, we'll use a structured analysis
            const analysis = await this.performResumeAnalysis(resumeContent);
            return analysis;
        } catch (error) {
            console.error('Resume analysis error:', error);
            return this.getFallbackResumeAnalysis();
        }
    }

    async generateMockInterviewFeedback(question, answer, jobRole = 'Software Engineer') {
        try {
            const prompt = `Mock Interview Feedback:

Job Role: ${jobRole}
Question: ${question}
Candidate Answer: ${answer}

Please provide detailed feedback on:
1. Answer quality and relevance
2. Technical accuracy
3. Communication skills
4. Areas for improvement
5. Suggested better response

Feedback:`;

            const feedback = await this.performInterviewAnalysis(question, answer, jobRole);
            return feedback;
        } catch (error) {
            console.error('Interview feedback error:', error);
            return this.getFallbackInterviewFeedback();
        }
    }

    performResumeAnalysis(content) {
        // Analyze resume content using keyword matching and structure analysis
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

        // Add specific recommendations based on content analysis
        const techKeywords = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker'];
        const foundTechSkills = techKeywords.filter(skill => contentLower.includes(skill));
        
        if (foundTechSkills.length > 0) {
            analysis.strengths.push(`Strong technical skills mentioned: ${foundTechSkills.join(', ')}`);
        } else {
            analysis.recommendations.push('Consider adding more specific technical skills relevant to your target role');
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

    performInterviewAnalysis(question, answer, jobRole) {
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

    getFallbackResponse(prompt) {
        return "I apologize, but I'm currently unable to process your request. Please try again later or contact support for assistance.";
    }

    getFallbackResumeAnalysis() {
        return {
            overallScore: 65,
            strengths: ['Resume structure appears organized', 'Contains relevant information'],
            weaknesses: ['Could benefit from more specific details', 'May need formatting improvements'],
            recommendations: [
                'Add quantifiable achievements with specific metrics',
                'Include more relevant keywords for your target role',
                'Ensure consistent formatting throughout the document'
            ],
            sections: {
                contact: { present: true, score: 15 },
                summary: { present: true, score: 10 },
                experience: { present: true, score: 20 },
                education: { present: true, score: 10 },
                skills: { present: true, score: 10 }
            }
        };
    }

    getFallbackInterviewFeedback() {
        return {
            overallScore: 70,
            strengths: ['Attempted to answer the question', 'Showed engagement'],
            weaknesses: ['Could provide more specific details', 'May need more technical depth'],
            recommendations: [
                'Include specific examples from your experience',
                'Use more technical terminology when appropriate',
                'Structure your answer with clear beginning, middle, and end'
            ],
            categories: {
                relevance: { score: 70, feedback: 'Answer addresses the question adequately' },
                technical: { score: 60, feedback: 'Some technical knowledge demonstrated' },
                communication: { score: 75, feedback: 'Clear communication style' },
                completeness: { score: 65, feedback: 'Answer covers main points but could be more detailed' }
            }
        };
    }
}

module.exports = new AIService();

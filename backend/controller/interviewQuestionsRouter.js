const express = require('express');
const interviewQuestionRouter = express.Router();

interviewQuestionRouter.get('/interviewQuestion', async (req, res) => {
    try {
        const interviewQuestion = [
            { Question: 'What is the full form of HTML?', answer: 'Hypertext Markup Language' },
            { Question: 'What is the full form of CSS?', answer: 'Cascading Style Sheets' }
        ];

        res.status(200).json(interviewQuestion); 
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
});

module.exports = interviewQuestionRouter;
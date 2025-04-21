const express = require('express');
const companyWiseQuestionRouter = express.Router();

companyWiseQuestionRouter.get('/companyWiseQuestion', async (req, res) => {
    try {
        const companyWiseQuestion = [
            { Question: 'What is the full form of HTML?', answer: 'Hypertext Markup Language' },
            { Question: 'What is the full form of CSS?', answer: 'Cascading Style Sheets' }
        ];

        res.status(200).send(companyWiseQuestion); 
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).send({ message: 'Internal Server Error' }); 
    }
});

module.exports = companyWiseQuestionRouter;
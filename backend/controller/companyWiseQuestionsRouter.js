const express = require('express');
const companyWiseQuestionRouter = express.Router();
const CompanyWiseQuestion = require('../models/companyWiseQuestionsSchema'); 

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

companyWiseQuestionRouter.post('/postCompanyWiseQuestion', async (req, res) => {
  try {
      const { question, answer } = req.body;
      const newCompanyWiseQuestion = new CompanyWiseQuestion({ question, answer });
      await newCompanyWiseQuestion.save();
      res.status(201).json({ message: 'Company-wise question posted successfully!', data: newCompanyWiseQuestion });
  } catch (error) {
      console.error('Error posting question:', error);
      res.status(500).json({ message: 'Error posting question', error });
  }
});

module.exports = companyWiseQuestionRouter;

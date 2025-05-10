const express = require('express');
const CompanyWiseQuestion = require('../models/companyWiseQuestionsSchema');
const companyWiseQuestionsRouter = express.Router();

companyWiseQuestionsRouter.get('/companyWiseQuestion', async (req, res) => {
    try {
        const companyWiseQuestion = [
            { question: 'What is the full form of HTML?', answer: 'Hypertext Markup Language' },
            { question: 'What is the full form of CSS?', answer: 'Cascading Style Sheets' }
        ];

        res.status(200).json(companyWiseQuestion);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

companyWiseQuestionsRouter.post('/postCompanyWiseQuestion', async (req, res) => {
    try {
        const { question, answer } = req.body;
        if (!question || !answer) {
            return res.status(400).send({ msg: "Please fill all the fields" });
        }
        const newQuestion = new CompanyWiseQuestion({ question, answer });
        await newQuestion.save();
        res.status(201).json({ message: 'Company-wise question posted successfully!', question: newQuestion });
    } catch (error) {
        console.error('Error posting question:', error);
        res.status(500).json({ message: 'Error posting question', error });
    }
});

companyWiseQuestionsRouter.put('/updateCompanyWiseQuestion/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ msg: "Please provide id" });
        }
        const { question, answer } = req.body;
        const updatedQuestion = await CompanyWiseQuestion.findByIdAndUpdate(
            id,
            { question, answer },
            { new: true }
        );
        res.status(200).send({ msg: "Data updated successfully", question: updatedQuestion });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error updating data" });
    }
});

companyWiseQuestionsRouter.delete('/deleteCompanyWiseQuestion/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ msg: "Please provide id" });
        }
        const deletedQuestion = await CompanyWiseQuestion.findByIdAndDelete({ _id: id });
        res.status(200).send({ msg: "Question deleted successfully" });
    } catch (error) {
        res.status(500).send({ msg: "Error deleting data" });
    }
});

companyWiseQuestionsRouter.patch('/patchCompanyWiseQuestion/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ message: "Please provide a valid id" });
        }

        const { question, answer } = req.body;
        if (!question && !answer) {
            return res.status(400).send({ message: "Please provide at least one field to update" });
        }

        const updatedQuestion = await CompanyWiseQuestion.findByIdAndUpdate(
            id,
            { question, answer },
            { new: true, runValidators: true }
        );

        if (!updatedQuestion) {
            return res.status(404).send({ message: "Question not found" });
        }

        res.status(200).send({ message: "Question updated successfully", question: updatedQuestion });
    } catch (error) {
        console.error("Update error:", error.message);
        res.status(500).send({ message: "Error updating Question", error: error.message });
    }
});

companyWiseQuestionsRouter.put('/companyWiseQuestion/updateQuestion/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ msg: "Please provide id" });
        }
        const { question, answer } = req.body;
        const Questionupdated = await CompanyWiseQuestion.findByIdAndUpdate(
            id,
            { question, answer },
            { new: true, runValidators: true }
        );

        if (!updatedQuestion) {
            return res.status(404).send({ msg: "Question not found" });
        }

        res.status(200).send({ msg: "Data updated successfully", question: updatedQuestion });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error updating data" });
    }
});

module.exports = companyWiseQuestionsRouter;

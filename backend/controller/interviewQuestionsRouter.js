const express = require('express');
const interviewQuestionsSchema = require('../models/interviewQuestionsSchema');
const interviewQuestionsRouter = express.Router();


interviewQuestionsRouter.get('/interviewQuestion', async (req, res) => {
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



interviewQuestionsRouter.get('/interviewQuestion', async (req, res) => {
    try {
        const interviewQuestion = [
            { question: 'What is the full form of HTML?', answer: 'Hypertext Markup Language' },
            { question: 'What is the full form of CSS?', answer: 'Cascading Style Sheets' }
        ];

        res.status(200).json(interviewQuestion);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


interviewQuestionsRouter.post('/postInterviewQuestion', async (req, res) => {
    try {
        const { question, answer } = req.body;
        if (!question || !answer) {
            return res.status(400).send({ msg: "Please fill question and answer" });
        }
        const newInterviewQuestion = new interviewQuestionsSchema({ question, answer });
        await newInterviewQuestion.save();
        res.status(201).json({ message: 'Interview question posted successfully!', question: newInterviewQuestion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting question', error });
    }
});

interviewQuestionsRouter.put('/updateInterviewQuestion/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ msg: "Please provide id" });
        }
        const { question, answer } = req.body;
        const updatedInterviewQuestion = await interviewQuestionsSchema.findByIdAndUpdate(
            { _id: id },
            { question, answer },
            { new: true }
        );
        res.status(200).send({ msg: "Data updated successfully", question: updatedInterviewQuestion });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error updating data" });
    }
});

interviewQuestionsRouter.delete('/deleteInterviewQuestion/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ msg: "Please provide id" });
        }
        const deletedInterviewQuestion = await interviewQuestionsSchema.findByIdAndDelete({ _id: id });
        res.status(200).send({ msg: "Question deleted successfully" });
    } catch (error) {
        res.status(500).send({ msg: "Error deleting data" });
    }
});

interviewQuestionsRouter.patch('/patchInterviewQuestion/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ message: "Please provide a valid id" });
        }

        const { question, answer } = req.body;
        if (!question && !answer) {
            return res.status(400).send({ message: "Please provide at least one field to update" });
        }

        const updatedInterviewQuestion = await interviewQuestionsSchema.findByIdAndUpdate(
            id,
            { question, answer },
            { new: true, runValidators: true }
        );

        if (!updatedInterviewQuestion) {
            return res.status(404).send({ message: "Question not found" });
        }

        res.status(200).send({ message: "Question updated successfully", question: updatedInterviewQuestion });
    } catch (error) {
        console.error("Update error:", error.message);
        res.status(500).send({ message: "Error updating question", error: error.message });
    }
});

module.exports = interviewQuestionsRouter;

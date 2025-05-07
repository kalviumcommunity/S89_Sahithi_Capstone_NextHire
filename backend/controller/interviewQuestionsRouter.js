const express = require('express');
const interviewQuestionsRouter = express.Router();
const InterviewQuestion = require('../models/interviewQuestionsSchema');

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

interviewQuestionsRouter.post('/postInterviewQuestion',async (req, res) => {
    try {
      const {question,answer} = req.body;
      if(!question || !answer){
        return res.status(400).send({msg:"Please fill question and answer"});
      }
      const newInterviewQuestion = new InterviewQuestion({ question, answer });
      await newInterviewQuestion.save();
      res.status(201).json({ message: 'interview question posted successfully!', questions: newInterviewQuestion });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error posting question', error });
      
    }
  });

interviewQuestionsRouter.put("/updateIQuestion/:id",async(req,res)=>{
    try {
        const{id}=req.params;
        if(!id){
            res.status(400).send({msg:"Please provide id"});
        }
        const {question,answer}=req.body;
        const updatedInterviewQuestion = await InterviewQuestion.findByIdAndUpdate({_id:id},{question,answer});
        res.status(200).send({msg:"Data updated successfully",question:updatedInterviewQuestion});
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:"Error updating data"})
    }
});



interviewQuestionsRouter.delete("/deleteIQuestion/:id",async(req,res)=>{
  try {
      const {id} = req.params;
      if(!id){
          return res.status(400).send({msg:"Please provide id"});
      }
      const deletedInterviewQuestion = await InterviewQuestion.findByIdAndDelete({_id:id});
      res.status(200).send({msg:"Question Deleted successfully"});
  } catch (error) {
      res.status(500).send({msg:"Error deleting data"})
  }
});

interviewQuestionsRouter.patch("/patchInterviewQuestion/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ message: "Please provide a valid id" });
        }

        const { question, answer } = req.body;
        if (!question && !answer) {
            return res.status(400).send({ message: "Please provide at least one field to update" });
        }

        const updatedInterviewQuestion = await InterviewQuestion.findByIdAndUpdate(
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
        res.status(500).send({ message: "Error updating Question", error: error.message });

    }
});






  module.exports = interviewQuestionsRouter;
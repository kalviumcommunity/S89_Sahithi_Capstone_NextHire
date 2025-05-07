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

companyWiseQuestionRouter.put("/updateQuestion/:id", async (req, res) => {
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

        if (!updatedQuestion) {
            return res.status(404).send({ msg: "Question not found" });
        }

        res.status(200).send({ msg: "Question updated successfully", question: updatedQuestion });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ msg: "Error updating data", error });
    }
});




companyWiseQuestionRouter.delete("/deleteQuestion/:id",async(req,res)=>{
    try {
        const{id}=req.params;
        if(!id){
            return res.status(400).send({msg:"Please provide id"});
        }
        const deletedCompanyWiseQuestion = await CompanyWiseQuestion.findByIdAndDelete({_id:id});
        res.status(200).send({msg:"Question deleted successfully"});
    } catch (error) {
        res.status(500).send({msg:"Error deleting question"})
    }
});


companyWiseQuestionRouter.patch("/patchCompanyWiseQuestion/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ message: "Please provide a valid id" });
        }

        const { question, answer } = req.body;
        if (!question && !answer) {
            return res.status(400).send({ message: "Please provide at least one field to update" });
        }

        const updatedCompanyWiseQuestion = await CompanyWiseQuestion.findByIdAndUpdate(
            id,
            { question, answer },
            { new: true, runValidators: true }
        );

        if (!updatedCompanyWiseQuestion) {
            return res.status(404).send({ message: "Question not found" });
        }

        res.status(200).send({ message: "Question updated successfully", question: updatedCompanyWiseQuestion });
    } catch (error) {
        console.error("Update error:", error.message);
        res.status(500).send({ message: "Error updating Question", error: error.message });

    }
});





module.exports = companyWiseQuestionRouter;

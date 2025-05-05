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

interviewQuestionRouter.put("/updateIQuestion/:id",async(req,res)=>{
    try {
        const{id}=req.params;
        if(!id){
            res.status(400).send({msg:"Please provide id"});
        }
        const {question,answer}=req.body;
        const updatedInterviewQuestion = await interviewQuestion.findByIdAndUpdate({_id:id},{questin,answer});
        res.status(200).send({msg:"Data updated successfully",question:updatedInterviewQuestion});
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:"Error updating data"})
    }
});

module.exports = interviewQuestionRouter;
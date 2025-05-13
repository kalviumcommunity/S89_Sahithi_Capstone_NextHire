const express = require('express');
const interviewQuestionRouter = express.Router();



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
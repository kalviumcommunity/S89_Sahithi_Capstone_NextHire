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

companyWiseQuestionRouter.put("/updateQuestion/:id",async(req,res)=>{
    try {
        const {id} = req.params;
        if(!id){
            res.status(400).send({msg:"Please provide id"});
        }
        const {question , answer}=req.body;
        const updateQuestion = await Question.findByIdAndUpdate({_id:id},{question,answer});
        res.status(200).send({msg:"Question updated successfully",Question:updatedQustion});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Error updating data"})
    }
});




module.exports = companyWiseQuestionRouter;
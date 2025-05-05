const express = require('express');
const jobBoardRouter = express.Router();

jobBoardRouter.get('/jobBoard', async (req, res) => {
    try {
        const jobBoard = [
            {role:'Software Engineer',company:'infosys', Salary:'6lakhs', place:'Hyderabad' },
            {role:'Software Engineer',company:'infosys', Salary:'6lakhs', place:'Hyderabad'}
        ];

        res.status(200).json(jobBoard); 
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
});
jobBoardRouter.put("/updateJobBoard/:id",async(req,res)=>{
    try {
        const{id}=req.params;
        if(!id){
            res.status(400).send({msg:"Please provide id"});
        }
        const {question,answer}=req.body;
        const updatedJobBoard = await jobBoard.findByIdAndUpdate({_id:id},{question,answer});
        res.status(200).send({msg:"Data updated successfully",board:updatedJobBoard});
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:"Error updating data"})
    }
});


module.exports = jobBoardRouter;
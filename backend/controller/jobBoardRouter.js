const express = require('express');
const jobBoardRouter = express.Router();
const jobBoard = require('../models/jobBoardSchema');

jobBoardRouter.get('/jobBoard', async (req, res) => {
    try {
        const jobBoard = [
            {role:'Software Engineer',company:'infosys', salary:'60000', place:'Hyderabad' },
            {role:'Software Engineer',company:'infosys', salary:'75000', place:'Hyderabad'}
        ];

        res.status(200).json(jobBoard); 
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
});

jobBoardRouter.post('/postJobBoard',async (req, res) => {
    try {
      const {role,company,salary,place} = req.body;
      if(!role || !company || !salary || !place){
        return res.status(400).send({msg:"Please fill all the fields"});
      }
      const newJobBoard = new jobBoard ({ role, company,salary,place});
      await newJobBoard.save();
      res.status(201).json({ message: 'JobBoard posted successfully!', job: newJobBoard });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error posting jobBoard', error });
      
    }
  });

jobBoardRouter.put("/updateJobBoard/:id",async(req,res)=>{
          try {
              const{id}=req.params;
              if(!id){
                  res.status(400).send({msg:"Please provide id"});
              }
              const {role,company,salary,place}=req.body;
              const updatedJobBoard = await jobBoard.findByIdAndUpdate({_id:id},{role,company,salary,place});
              res.status(200).send({msg:"Data updated successfully",job:updatedJobBoard});
          } catch (error) {
              console.log(error)
              res.status(500).send({msg:"Error updating data"})
          }
      });



module.exports = jobBoardRouter;
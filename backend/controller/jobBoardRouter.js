const express = require('express');
const jobBoardSchema = require('../models/jobBoardSchema');
const jobBoardRouter = express.Router();


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
      const newJobBoard = new jobBoardSchema ({ role, company,salary,place});
      await newJobBoard.save();
      res.status(201).json({ message: 'JobBoard posted successfully!', job: newJobBoard });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error posting jobBoard', error });
      
    }
  });




jobBoardRouter.delete("/deletejobBoard/:id",async(req,res)=>{
  try {
      const {id} = req.params;
      if(!id){
          return res.status(400).send({msg:"Please provide id"});
      }
      const deletedJobBoard = await jobBoardSchema.findByIdAndDelete({_id:id});
      res.status(200).send({msg:"Question Deleted successfully"});
  } catch (error) {
      res.status(500).send({msg:"Error deleting data"})
  }
});



jobBoardRouter.patch("/patchJobBoard/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ message: "Please provide a valid id" });
        }

        const {  role,company,salary,place} = req.body;
        if (!role && !company && !salary && !place) {
            return res.status(400).send({ message: "Please provide at least one field to update" });
        }

        const updatedJobBoard = await jobBoardSchema.findByIdAndUpdate(
            id,
            {role,company,salary,place },
            { new: true, runValidators: true }
        );

        if (!updatedJobBoard) {
            return res.status(404).send({ message: "Question not found" });
        }

        res.status(200).send({ message: "Question updated successfully", jobBoard: updatedJobBoard });
    } catch (error) {
        console.error("Update error:", error.message);
        res.status(500).send({ message: "Error updating Question", error: error.message });

    }
});

jobBoardRouter.put("/updateJobBoard/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ msg: "Please provide id" });
        }

        const { role, company, salary, place } = req.body;
        if (!role || !company || !salary || !place) {
            return res.status(400).send({ msg: "All fields (role, company, salary, place) are required" });
        }

        const updatedJobBoard = await jobBoardSchema.findByIdAndUpdate(
            { _id: id },
            { role, company, salary, place },
            { new: true, runValidators: true }
        );

        if (!updatedJobBoard) {
            return res.status(404).send({ msg: "Job board entry not found" });
        }

        res.status(200).send({ msg: "Data updated successfully", job: updatedJobBoard });
    } catch (error) {
        console.error("Error updating job board:", error);
        res.status(500).send({ msg: "Error updating data" });
    }
});

module.exports = jobBoardRouter;
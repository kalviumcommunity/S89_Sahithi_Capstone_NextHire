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

module.exports = jobBoardRouter;
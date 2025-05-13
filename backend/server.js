const express = require("express");
const app = express();
const cors = require('cors');

const CompanyWiseQuestion = require('C:/Users/user/Documents/Capstone Project/S89_Sahithi_Capstone_NextHire/backend/models/companyWiseQuestionsSchema.js');


const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

app.use(cors());

app.use(express.json());
mongoose.connect('mongodb+srv://bhumireddysahithi:IlQ8h2lSJnS1uyw5@cluster0.ao7krsf.mongodb.net/',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//const interviewQuestionsRouter = require("./controller/interviewQuestionsRouter");
//const jobBoardRouter = require("./controller/jobBoardRouter");
//const companyWiseQuestionRouter = require("./controller/companyWiseQuestionsRouter");


//app.use("/interviewQuestion", interviewQuestionsRouter);
//app.use("/jobBoard",jobBoardRouter);
//app.use("/companyWiseQuestion",companyWiseQuestionRouter);

app.get('/companyWiseQuestion', async(req, res) => {
    const companyWiseQuestion = await CompanyWiseQuestion.find();
    res.json(companyWiseQuestion);
});



app.listen(3000,async()=>{
    try {
        //await mongoose.connect(process.env.MONGO)
        console.log("Server running on port 3000");
    } catch (error) {
        console.log("Error",error)
    }
});
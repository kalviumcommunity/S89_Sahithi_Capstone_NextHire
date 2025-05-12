const express = require("express");
const app = express();

const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

const interviewQuestionsRouter = require("./controller/interviewQuestionsRouter");
const jobBoardRouter = require("./controller/jobBoardRouter");
const companyWiseQuestionRouter = require("./controller/companyWiseQuestionsRouter");


app.use("/interviewQuestion", interviewQuestionsRouter);
app.use("/jobBoard",jobBoardRouter);
app.use("/companyWiseQuestion",companyWiseQuestionRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the NextHire API");
});



app.listen(3000,async()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Server running on port 3000");
    } catch (error) {
        console.log("Error",error)
    }
});
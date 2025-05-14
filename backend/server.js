const express = require("express");
const app = express();

const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

const interviewQuestionsRouter = require("./controller/interviewQuestionsRouter");
const jobBoardRouter = require("./controller/jobBoardRouter");
const companyWiseQuestionRouter = require("./controller/companyWiseQuestionsRouter");


app.use("/api", interviewQuestionsRouter);
app.use("/jobBoard",jobBoardRouter);
app.use("/companyWiseQuestion",companyWiseQuestionRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the Interview Preparation API");
});

const PORT = 3000; // Or any port you prefer
app.listen(PORT,async()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
        console.log("Error",error)
    }
});
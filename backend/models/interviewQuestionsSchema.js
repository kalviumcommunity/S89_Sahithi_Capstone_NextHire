const mongoose = require("mongoose");
const { post } = require("../controller/interviewQuestionsRouter");

const interviewQuestionsSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
    
});


module.exports = mongoose.model('interviewQuestion', interviewQuestionsSchema);
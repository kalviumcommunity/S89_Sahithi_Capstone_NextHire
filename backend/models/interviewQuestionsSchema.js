const mongoose = require("mongoose");
const { post } = require("../controller/interviewQuestionsRouter");

const schema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
    
});


const interviewQuestionsSchema = mongoose.model('interviewQuestion', schema);

module.exports = interviewQuestionsSchema;

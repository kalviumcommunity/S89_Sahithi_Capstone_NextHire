const mongoose = require("mongoose");
const { post } = require("../controller/companyWiseQuestionsRouter");

const companyWiseQuestionsSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
    
});


module.exports = mongoose.model('CompanyWiseQuestion', companyWiseQuestionsSchema);
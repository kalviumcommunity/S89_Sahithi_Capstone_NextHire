const mongoose = require('mongoose');

const companyWiseQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

const CompanyWiseQuestion = mongoose.model('companyWiseQuestion', companyWiseQuestionSchema);

module.exports = CompanyWiseQuestion;

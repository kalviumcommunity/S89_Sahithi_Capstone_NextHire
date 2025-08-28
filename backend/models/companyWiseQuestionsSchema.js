const mongoose = require('mongoose');

const companyWiseQuestionSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
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
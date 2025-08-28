const mongoose = require('mongoose');

const companyWiseQuestionSchema = new mongoose.Schema({
<<<<<<< HEAD
    company: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
=======
>>>>>>> f7a228e295525be971f5921a81983eb8f92dbadb
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

<<<<<<< HEAD
module.exports = CompanyWiseQuestion;
=======
module.exports = CompanyWiseQuestion;
>>>>>>> f7a228e295525be971f5921a81983eb8f92dbadb

const mongoose = require("mongoose");

const companyWiseQuestionsSchema = new mongoose.Schema({
    company_Name:{
        type: String,
        required: true 
    },
    role:{
        type: String,
        required:true
    },
    range:{
        type: String,
        required: true
    }
    
});


const Questions = mongoose.modek("Questions",)
module.exports = companyWiseQuestionsSchema
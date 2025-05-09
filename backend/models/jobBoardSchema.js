const mongoose = require("mongoose");
const { post } = require("../controller/jobBoardRouter");

const schema = new mongoose.Schema({
    role:{type: String , required:true},
    company:{type: String , required:true},
    salary:{type: Number , required:true}, 
    place:{type: String , required:true}
    
});

const jobBoardSchema = mongoose.model('jobBoard', schema);

module.exports = jobBoardSchema;
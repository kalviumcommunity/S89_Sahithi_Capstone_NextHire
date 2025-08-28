const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    role:{type: String , required:true,trim:true},
    company:{type: String , required:true,trim:true},
    salary:{type: Number , required:true,min:0}, 
    place:{type: String , required:true,trim:true}
    
});

const jobBoardSchema = mongoose.model('jobBoard', schema);

module.exports = jobBoardSchema;
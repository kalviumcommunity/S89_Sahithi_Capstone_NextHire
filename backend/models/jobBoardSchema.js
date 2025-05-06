const mongoose = require("mongoose");
const { post } = require("../controller/jobBoardRouter");

const jobBoardSchema = new mongoose.Schema({
    role:{type: String , required:true},
    company:{type: String , required:true},
    salary:{type: Number , required:true}, 
    place:{type: String , required:true}
    
});


module.exports = mongoose.model('joBoard', jobBoardSchema);
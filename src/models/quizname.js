const mongoose = require("mongoose");
const quizNameSchema = new mongoose.Schema({
    
    creator:String,
    quizname:String
})

const Quizname = new mongoose.model("Quizname", quizNameSchema);
module.exports = Quizname;
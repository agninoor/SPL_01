const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema({
    
    creator:String,
    quizname:String,
    creator:String,
    question:String,
    a: String,
    b:String,
    c:String,
    d:String,
    correct : String
})

const Quizone = new mongoose.model("Quizone", quizSchema);
module.exports = Quizone;
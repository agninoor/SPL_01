const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema({
    quizname:String,
    creator:String,
    question:String,
    a: String,
    b:String,
    c:String,
    d:String,
    correct : String
})

const Quiz = new mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema({
    
    question:String,
    marks: String,
    a: String,
    b:String,
    c:String,
    d:String,
    correct : String
})

const Quiztwo = new mongoose.model("Quiztwo", quizSchema);
module.exports = Quiztwo;
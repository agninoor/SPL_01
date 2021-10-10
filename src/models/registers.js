const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique:true
    },
    emailid:{
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    }
})

const Register = new mongoose.model("Register", userSchema);
module.exports = Register;
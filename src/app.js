const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");


const port = process.env.PORT || 3000;

require("./db/conn");

const Register = require("./models/registers");
const Quiz = require("./models/quiz");

const static_path = path.join(__dirname, "../public") ;
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res)=>{
    res.render("index")
});

app.get("/login", (req,res)=>{
    res.render("login");
})

app.get("/registration",(req,res)=>{
    res.render("registration");

})
app.get("/makequiz",(req,res)=>{
    res.render("makequiz");

})

app.post("/makequiz",async(req,res)=>{
   
    try {
        const makeQuiz = new Quiz({
            question: req.body.question,
            a:req.body.a,
            b:req.body.b,
            testArray:req.body.c,
            correct: req.body.correct
        })
        const quizMade = await makeQuiz.save();
        res.status(201).render(makeQuiz);
        
    } catch (error) {
        res.status(400).send(error);
    }
})



app.post("/registration", async(req,res)=>{
    try {
    const password = req.body.password;
    const cpassword = req.body.confirmpass;
    const username = req.body.username;
    

    if(password===cpassword){
        const RegisterAccount = new Register({

        fullname :req.body.fullname,
        username : req.body.username,
        emailid :req.body.emailid,
        password : password
        })
        const Registered = await RegisterAccount.save();
        res.status(201).render("index");

    }else{
        res.send("passwords are not matching");
    }
        
    } catch (error) {
        res.status(400).send(error);
        
    }
})

app.post("/login", async(req,res)=>{
    try{
    const username = req.body.username;
    const password = req.body.password;
    const emailid = req.body.emailid;

    const findName = await Register.findOne({username : username});

    if(findName.password===password && findName.emailid==emailid){
        res.status(201).render("dashboard",{
            userName :username
        });
    }else{
        res.send("invalid login details")
    }
}catch(error){
    res.status(400).send(error);
}
})


app.listen(port, ()=>{
    console.log(`server is running at port ${port}`);
})
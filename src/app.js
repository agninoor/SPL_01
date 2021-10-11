const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

const port = process.env.PORT || 3000;

require("./db/conn");

const Register = require("./models/registers");
const Quizone = require("./models/quiz1");
const Quiztwo = require("./models/quiz2");
const Quizname = require("./models/quizname");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "secret",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(static_path));
app.set("view engine", "hbs");

app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/registration", (req, res) => {
  res.render("registration");
});
app.get("/makequiz", (req, res) => {
  res.render("makequiz");
});
app.get("/showquiz", (req, res) => {
  res.render("showquiz");
});
app.get("/templateview", (req, res) => {
  res.render("templateview");
});
app.get("/quiz1", (req, res) => {
  res.render("quiz1");
});
app.get("/quiz2", (req, res) => {
  res.render("quiz2");
});
app.get("/manual", (req, res) => {
  res.render("manual");
});
app.get("/quizname", (req, res) => {
  res.render("quizname");
});
app.get("/searchquiz", (req, res) => {
  res.render("searchquiz");
});
app.get("/dashboard", (req, res) => {
  const session = req.session;
  if (session.username == undefined) {
    res.status(201).render("login");
  } else {
    const creator = req.session.username;
    const info = {
      creator: creator,
    };

    res.status(201).render("dashboard", {
      userName: session.username,
      encodedJson: encodeURIComponent(JSON.stringify(info)),
    });
  }
});
app.get("/getquiz/:creatorname/:quizname", (req, res) => {
  console.log(req.params);
  const creator = req.params.creatorname;
  const quizName = req.params.quizname;
  let quizdata = Quizone.find(
    { creator: creator, quizname: quizName },
    function (err, posts) {
      if (err) {
        console.log(err);
      } else {
        res.json(posts);
      }
    }
  );
});
app.get("/getuserquizzes/:creatorname", (req, res) => {
  const creatorname = req.params.creatorname;
  let userquizzes = Quizname.find(
    { creator: creatorname },
    function (err, posts) {
      if (err) {
        console.log(err);
      } else {
        res.json(posts);
      }
    }
  );
});

app.post("/quiz1", async (req, res) => {
  try {
    const makeQuiz = new Quizone({
      creator: req.session.username,
      quizname: req.session.quizname,
      question: req.body.question,
      a: req.body.a,
      b: req.body.b,
      c: req.body.c,
      d: req.body.d,
      correct: req.body.correct,
    });
    const quizMade = await makeQuiz.save();
    res.status(201).render("quiz1");
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post("/quiz2", async (req, res) => {
  try {
    const makeQuiz = new Quiztwo({
      question: req.body.question,
      marks: req.body.marks,
      a: req.body.a,
      b: req.body.b,
      c: req.body.c,
      d: req.body.d,
      correct: req.body.correct,
    });
    const quizMade = await makeQuiz.save();
    res.status(201).render("quiz2");
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post("/quizname", async (req, res) => {
  console.log(req.session);
  try {
    const makeQuiz = new Quizname({
      creator: req.body.creator,
      quizname: req.body.quizname,
    });
    const quizMade = await makeQuiz.save();
    req.session.quizname = req.body.quizname;

    res.status(201).render("quiz1");
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/registration", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpass;
    const username = req.body.username;

    if (password === cpassword) {
      const RegisterAccount = new Register({
        fullname: req.body.fullname,
        username: req.body.username,
        emailid: req.body.emailid,
        password: password,
      });
      const Registered = await RegisterAccount.save();
      res.status(201).render("index");
    } else {
      res.send("passwords are not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;

    const password = req.body.password;
    const emailid = req.body.emailid;

    const findName = await Register.findOne({ username: username });

    if (findName.password === password && findName.emailid == emailid) {
      const session = req.session;
      session.username = username;
      console.log(req.session);
      const creator = req.session.username;
      const info = {
        creator: creator,
      };

      res.status(201).render("dashboard", {
        userName: session.username,
        encodedJson: encodeURIComponent(JSON.stringify(info)),
      });
    } else {
      res.send("invalid login details");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post("/getquiz", async (req, res) => {
  try {
    const quizname = req.body.quizname;
    const creator = req.body.creator;
    const info = {
      quizname: quizname,
      creator: creator,
    };
    console.log(quizname, creator);
    res.status(200).render("showquiz", {
      encodedJson: encodeURIComponent(JSON.stringify(info)),
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});

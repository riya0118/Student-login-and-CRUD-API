const router = require("express").Router();
const Student = require("../models/Student");

const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const checktoken = require("../jwt/checktoken");
const localStorage = require("localStorage");

router.post("/login",
  check('username').not().isEmpty().withMessage("Username is required"),
  check('password').not().isEmpty().withMessage("Password is required"),
  async (req, res) => {
    try {
      let student = await Student.findOne({ username: req.body.username });
      if (student) {
        if (req.body.password == student.password) {
          const data = student;
          const token = jwt.sign({ student: data }, process.env.JWT_SECRET);
          student = {
            authtoken: token
          }
          localStorage.setItem('token', token);
          res.send(token);
        }
        else {
          res.send("Your password is incorrect");
        }
      }
      else {
        res.send("Invalid credentials");
      }
    }
    catch (error) {
      console.log(error);
      res.status(500).send("Some error occur while login")
    }
  });

router.get("/", checktoken, async(req, res) => {
  try{
    const students = await Student.find().select("-password");
    res.send(students);
  }
  catch(err){
    res.status(500).send("Some error occured while getting students data");
  }
})

router.post("/", (req, res) => {
  const addStudent = new Student({
    rollno: req.body.rollno,
    name: req.body.name,
    age: req.body.age,
    sem: req.body.sem,
    username: req.body.username,
    password: req.body.password
  });
  addStudent.save((err, student) => {
    res.send(student);
  })
})

router.get("/:id", (req, res) => {
  Student.findById({"_id": req.params.id}, (err, student) => {
    if(err) res.status(500).send(err);
    if(!student) return res.status(404).send("No Data Found");
    res.send(student);
  })
})

router.put("/:id", (req, res) => {
  Student.findOneAndUpdate({"_id": req.params.id}, req.body, { new: true }, (err, student) => {
    if(err) res.status(500).send("There was a problem while updating the document");
    res.status(200).send(student);
  })
})

router.delete("/:id", (req, res) => {
  Student.findOneAndRemove({"_id": req.params.id}, (err, student) => {
    if(err) res.status(500).send(err);
    res.send(student);
  })
})

module.exports = router;
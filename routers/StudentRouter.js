const router = require('express').Router();
const Student = require("../models/Student");

const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const checktoken = require("../jwt/checktoken");
const localStorage = require("localStorage");


router.post("/login", (req, res) => {
  Student.find({ username: req.body.username }, (err, data) => {
    const student = data[0];
    if (student) {
      console.log("correct!!")
      if (student && req.body.password == student.password) {
        const token = jwt.sign({ studentID: student._id }, process.env.JWT_SECRET);
        localStorage.setItem('token', token);
        res.send(token);
        console.log(token);
      }
      else {
        res.status(401).send("Unauthorized!!");
      }
    }
    else {
      res.status(401).send("Incorrect Crendenitals!!");
      console.log("incorrecrt!!");
    }
  })
})

router.get("/", checktoken, async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.send(students);
  }
  catch (err) {
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
  Student.findById({ "_id": req.params.id }, (err, student) => {
    if (err) res.status(500).send(err);
    if (!student) return res.status(404).send("No Data Found");
    res.send(student);
  })
})

router.put("/:id", (req, res) => {
  Student.findOneAndUpdate({ "_id": req.params.id }, req.body, { new: true }, (err, student) => {
    if (err) res.status(500).send("There was a problem while updating the document");
    res.status(200).send(student);
  })
})

router.delete("/:id", (req, res) => {
  Student.findOneAndRemove({ "_id": req.params.id }, (err, student) => {
    if (err) res.status(500).send(err);
    res.send(student);
  })
})

module.exports = router;
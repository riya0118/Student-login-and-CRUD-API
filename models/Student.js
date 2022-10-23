const mongoose = require('../config/db');

var StudentSchema = mongoose.Schema({
  rollno: Number,
  name: String,
  age: Number,
  sem: Number,
  username: {
    type: String,
    unique: true
  },
  password: String
});

var Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
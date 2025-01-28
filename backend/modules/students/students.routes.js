const express = require("express");
const auth = require("../../middleware/auth");
const getStudents = require("./getStudents");
const delStudent = require("./delStudent");
const getStudentsByTeacher = require("./getStudentByTeacher");
const studentRouter = express.Router();

studentRouter.get("/", getStudents);
studentRouter.use(auth);
studentRouter.get("/teacher", getStudentsByTeacher);
studentRouter.delete("/delete/:studentId", delStudent);
module.exports = studentRouter;

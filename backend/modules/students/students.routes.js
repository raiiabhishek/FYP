const express = require("express");
const auth = require("../../middleware/auth");
const getStudents = require("./getStudents");
const delStudent = require("./delStudent");
const studentRouter = express.Router();

studentRouter.get("/", getStudents);
studentRouter.use(auth);
studentRouter.delete("/delete/:studentId", delStudent);
module.exports = studentRouter;

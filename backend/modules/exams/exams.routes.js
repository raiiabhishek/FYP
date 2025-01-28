const express = require("express");
const auth = require("../../middleware/auth");
const examRouter = express.Router();

const createExam = require("./createExam");
const getExams = require("./getExams");
const getExamById = require("./getExamById");
const editExam = require("./editExam");
const deleteExam = require("./delExam");
const getExamByCourse = require("./getExamByCourse");

examRouter.get("/", getExams);
examRouter.get("/getExam/:examId", getExamById);
examRouter.get("/course/:course", getExamByCourse);
examRouter.use(auth);
examRouter.post("/create", createExam);
examRouter.patch("/edit/:examId", editExam);
examRouter.delete("/delete/:examId", deleteExam);

module.exports = examRouter;

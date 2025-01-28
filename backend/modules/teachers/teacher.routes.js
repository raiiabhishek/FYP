const express = require("express");
const getTeachersByCourse = require("./getTeachersByCourse");
const getTeachers = require("./getTeachers");
const auth = require("../../middleware/auth");
const teacherRouter = express.Router();

teacherRouter.get("/", getTeachers);
teacherRouter.get("/course/:course", getTeachersByCourse);
teacherRouter.use(auth);
teacherRouter.delete("/delete/:teacherId");
module.exports = teacherRouter;

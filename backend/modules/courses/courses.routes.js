const express = require("express");
const auth = require("../../middleware/auth");
const getCourses = require("./getCourses");
const getCourseById = require("./getCourseById");
const createCourse = require("./createCourse");
const editCourse = require("./editCourse");
const delCourse = require("./delCourse");
const courseRouter = express.Router();

courseRouter.get("/", getCourses);
courseRouter.get("getCourseById/:courseId", getCourseById);
courseRouter.use(auth);
courseRouter.post("/create", createCourse);
courseRouter.patch("/edit/:courseId", editCourse);
courseRouter.delete("/delete/:courseId", delCourse);

module.exports = courseRouter;

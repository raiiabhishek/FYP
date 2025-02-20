const express = require("express");
const auth = require("../../middleware/auth");
const getTimetable = require("./getTimetable");
const getTimetableById = require("./getTimetableById");
const createTimetable = require("./createTimetable");
const editTimetable = require("./editTimetable");
const deleteTimetable = require("./deleteTimetable");
const uploadMiddleware = require("../../middleware/upload");
const getTimetableByStd = require("./getTimetableByStd");
const getTimetableByTeacher = require("./getTimetableByTeacher");
const timetableRouter = express.Router();
timetableRouter.get("/", getTimetable);
timetableRouter.get("/getTimtetable/:timetableId", getTimetableById);
timetableRouter.use(auth);
timetableRouter.get("/student/", getTimetableByStd);
timetableRouter.get("/teacher/", getTimetableByTeacher);
timetableRouter.post("/create", uploadMiddleware, createTimetable);
timetableRouter.patch("/edit/:timetableId", editTimetable);
timetableRouter.delete("/delete/:timetableId", deleteTimetable);
module.exports = timetableRouter;

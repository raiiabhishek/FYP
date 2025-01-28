const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Routes
const login = require("./handlers/login");
const signUp = require("./handlers/signUp");
const uploadMiddleware = require("./middleware/upload");
const forgotPassword = require("./handlers/forgotPass");
const auth = require("./middleware/auth");
const user = require("./handlers/user");
const getUserByID = require("./handlers/getUserById");
const settings = require("./handlers/settings");
const courseRouter = require("./modules/courses/courses.routes");
const moduleRouter = require("./modules/module/module.routes");
const eventRouter = require("./modules/events/events.routes");
const timetableRouter = require("./modules/timetable/timetable.routes");
const groupRouter = require("./modules/groups/groups.routes");
const examRouter = require("./modules/exams/exams.routes");
const teacherRouter = require("./modules/teachers/teacher.routes");
const getUsers = require("./handlers/getUsers");
const studentRouter = require("./modules/students/students.routes");
const announcementRouter = require("./modules/announcements/announcements.routes");
// Models
require("./models/userModel");
require("./models/coursesModel");
require("./models/eventModule");
require("./models/examsMOdel");
require("./models/moduleModel");
require("./models/timetableModel");
require("./models/groupsModel");
require("./models/announcementModel");
// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));
// Database Connection
mongoose
  .connect(process.env.mongo_connect, {})
  .then(() => console.log("mongo connected"))
  .catch((e) => console.log(e));

// Routes
app.post("/login", login);
app.post("/signUp/", uploadMiddleware, signUp);
app.post("/settings", uploadMiddleware, settings);
app.post("/forgot-password", forgotPassword.forgotPassword);
app.post("/reset-password/:token", forgotPassword.resetPassword);
app.get("/getUser/:id", getUserByID);
app.get("/users", getUsers);

app.use("/courses", courseRouter);
app.use("/modules", moduleRouter);
app.use("/events", eventRouter);
app.use("/timetables", timetableRouter);
app.use("/groups", groupRouter);
app.use("/exams", examRouter);
app.use("/announcements", announcementRouter);
app.use("/teachers", teacherRouter);
app.use("/students", studentRouter);
// Start the server
app.listen(8000, () => {
  console.log("Server started on port 8000");
});

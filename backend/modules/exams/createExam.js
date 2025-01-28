const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const createExam = async (req, res) => {
  const ExamModel = mongoose.model("Exams");
  const ModuleModel = mongoose.model("Modules");
  const CourseModel = mongoose.model("Courses");
  const UserModel = mongoose.model("User");

  const { module, examDate, name } = req.body;
  try {
    // 1. Find the module and retrieve its details
    const getModule = await ModuleModel.findOne({ name: module });
    if (!getModule) {
      return res
        .status(404)
        .send({ status: "failed", message: "Module Not Found" });
    }
    // 2. Find the course associated with the module
    const getCourse = await CourseModel.findById(getModule.course);
    if (!getCourse) {
      return res
        .status(404)
        .send({ status: "failed", message: "Course not found for the Module" });
    }
    // 3. Find all users enrolled in the course
    const enrolledUsers = await UserModel.find({
      course: getCourse._id,
    });

    //4. Create the Exam
    const savedExam = await ExamModel.create({
      module: getModule._id,
      examDate,
      name,
    });

    //5. Create Single Email for all the users
    if (!enrolledUsers || enrolledUsers.length === 0) {
      return res.status(200).send({
        status: "success",
        message: "Exam created, but no users to notify for this course.",
      });
    }
    const userEmails = enrolledUsers.map((user) => user.email);
    const emailBody = `<p>Dear users,</p>
                    <p>A new exam <strong>${name}</strong> has been scheduled for the module ${getModule.name} in the course ${getCourse.name}. </p>
                    <p>The exam is scheduled on : ${examDate}</p>
                    <p>Please prepare accordingly.</p>`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmails, // Send to all users
      subject: `New Exam Scheduled for ${getModule.name} in ${getCourse.name} Course`,
      html: emailBody,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(
        `Email sent to all users enrolled in ${getCourse.name} course`
      );
      res.status(201).send({
        status: "success",
        message: "Exam Created and email sent successfully!",
      });
    } catch (error) {
      console.error(`Error sending email to all users:`, error);
      res.status(500).send({
        status: "failed",
        message: `Failed to send email to all users: ${error.message}`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ status: "failed", message: error.message });
  }
};

module.exports = createExam;

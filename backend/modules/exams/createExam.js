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
  const UserModel = mongoose.model("Users");

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
      courses: getCourse._id,
    });

    //4. Create the Exam
    const savedExam = await ExamModel.create({
      module: getModule._id,
      examDate,
      name,
    });

    // 5. Prepare the email notification
    const emailPromises = enrolledUsers.map(async (user) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `New Exam Scheduled for ${getModule.name} in ${getCourse.name} Course`,
        html: `<p>Dear ${user.name},</p>
                  <p>A new exam <strong>${name}</strong> has been scheduled for the module ${getModule.name} in the course ${getCourse.name}. </p>
                  <p>The exam is scheduled on : ${examDate}</p>
                  <p>Please prepare accordingly.</p>`,
      };

      // Send email
      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${user.email}`);
      } catch (error) {
        console.error(`Email failed to send to ${user.email}`, error);
      }
    });
    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    res.status(201).send({
      status: "success",
      message: "Exam Created and Email Sent Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ status: "failed", message: error.message });
  }
};

module.exports = createExam;

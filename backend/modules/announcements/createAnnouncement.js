const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const createAnnouncement = async (req, res) => {
  console.log("create");
  const AnnouncementModel = mongoose.model("Announcements");
  const CourseModel = mongoose.model("Courses");
  const UserModel = mongoose.model("User");
  const { name, description, course } = req.body;
  try {
    const getCourse = await CourseModel.findOne({ name: course });
    if (!getCourse) throw "No such course";
    const newAnnouncement = await AnnouncementModel.create({
      name,
      description,
      course: getCourse._id,
    });
    const enrolledUsers = await UserModel.find({
      course: getCourse._id,
    });
    if (!enrolledUsers || enrolledUsers.length === 0) {
      return res.status(200).send({
        status: "success",
        message:
          "Announcement created, but no users to notify for this course.",
      });
    }
    const userEmails = enrolledUsers.map((user) => user.email);
    const emailBody = `<p>Dear users,</p>
                    <p>A new announcement <strong>${name}</strong> has been published`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmails, // Send to all users
      subject: `New Annoucnement`,
      html: emailBody,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to all users enrolled in ${getCourse.name} course`);
    res.status(201).send({ status: "success" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
module.exports = createAnnouncement;

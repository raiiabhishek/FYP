const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const createTimetable = async (req, res) => {
  const TimetableModel = mongoose.model("Timetable");
  const GroupModel = mongoose.model("Groups");
  const UserModel = mongoose.model("Users");

  const { name, group, startDate, endDate, entries } = req.body;
  try {
    // 1. Find the group
    const getGroup = await GroupModel.findOne({ name: group });
    if (!getGroup) {
      return res
        .status(404)
        .send({ status: "failed", message: "Group not found" });
    }
    // 2. Find all the students in the group
    const enrolledUsers = await UserModel.find({ groups: getGroup._id });

    // 3. Create new timetable
    const newTimetable = await TimetableModel.create({
      name,
      group: getGroup._id,
      startDate,
      endDate,
      entries,
    });
    if (!enrolledUsers || enrolledUsers.length === 0) {
      return res.status(200).send({
        status: "success",
        message: "Timetable created, but no users to notify for this group.",
      });
    }
    // 4. Send emails to students in the group
    const emailPromises = enrolledUsers.map(async (user) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `New Timetable Created for ${getGroup.name} Group`,
        html: `<p>Dear ${user.name},</p>
                  <p>A new timetable named <strong>${name}</strong> has been created for the group ${getGroup.name}.</p>
                  <p>The timetable is valid from ${startDate} to ${endDate}.</p>
                  <p>Please check the system for the complete timetable entries.</p>`,
      };
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
      message: "Timetable created, and emails sent successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(400).send({ status: "failed", message: err.message });
  }
};

module.exports = createTimetable;

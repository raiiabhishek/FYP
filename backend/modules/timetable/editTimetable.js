const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const editTimetable = async (req, res) => {
  const TimetableModel = mongoose.model("Timetable");
  const GroupModel = mongoose.model("Groups");
  const UserModel = mongoose.model("Users");

  const { name, group, startDate, endDate, entries } = req.body;
  const { timetableId } = req.params;

  try {
    // 1. Find the group
    const getGroup = await GroupModel.findOne({ name: group });
    if (!getGroup) {
      return res
        .status(404)
        .send({ status: "failed", message: "Group not found" });
    }

    // 2. Find all students in the group
    const enrolledUsers = await UserModel.find({ groups: getGroup._id });

    // 3. Update the timetable
    const updatedTimetable = await TimetableModel.findByIdAndUpdate(
      timetableId,
      {
        name,
        group: getGroup._id,
        startDate,
        endDate,
        entries,
      }
    );
    if (!updatedTimetable) {
      return res
        .status(404)
        .send({ status: "failed", message: "Timetable not found" });
    }
    if (!enrolledUsers || enrolledUsers.length === 0) {
      return res.status(200).send({
        status: "success",
        message: "Timetable updated, but no users to notify for this group.",
      });
    }
    // 4. Send a single email to all users in the group
    const userEmails = enrolledUsers.map((user) => user.email);
    const emailBody = `<p>Dear users,</p>
                 <p>The timetable <strong>${name}</strong> for the group ${getGroup.name} has been updated.</p>
                 <p>The updated timetable is valid from ${startDate} to ${endDate}.</p>
                 <p>Please check the system for the updated timetable entries.</p>`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmails, // Send to all users at once
      subject: `Timetable Updated for ${getGroup.name} Group`,
      html: emailBody,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to all users in group: ${getGroup.name}`);
      res.status(201).send({
        status: "success",
        message: "Timetable updated and email sent successfully!",
      });
    } catch (error) {
      console.error(`Error sending email to all users`, error);
      res.status(500).send({
        status: "failed",
        message: `Failed to send email to all users: ${error.message}`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(400).send({ status: "failed", message: err.message });
  }
};

module.exports = editTimetable;

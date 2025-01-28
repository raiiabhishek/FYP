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
  console.log("in timetable");
  const TimetableModel = mongoose.model("Timetable");
  const GroupModel = mongoose.model("Groups");
  const UserModel = mongoose.model("User");

  const { name, group, startDate, endDate, entries } = req.body;
  console.log(name);

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

    // **IMPORTANT**: Parse the entries from a string to JSON array if it's coming from a string.
    let parsedEntries;
    try {
      parsedEntries =
        typeof entries === "string" ? JSON.parse(entries) : entries;
    } catch (parseErr) {
      console.error("Failed to parse entries", parseErr);
      return res.status(400).send({
        status: "failed",
        message:
          "Invalid format for entries, it needs to be a JSON array of objects",
      });
    }
    console.log(parsedEntries);
    // 3. Create new timetable
    const newTimetable = await TimetableModel.create({
      name,
      group: getGroup._id,
      startDate,
      endDate,
      entries: parsedEntries, // Use the parsed JSON array
    });

    if (!enrolledUsers || enrolledUsers.length === 0) {
      return res.status(200).send({
        status: "success",
        message: "Timetable created, but no users to notify for this group.",
      });
    }

    // 4. Create a single email to all users in the group
    const userEmails = enrolledUsers.map((user) => user.email);
    const emailBody = `<p>Dear users,</p>
                      <p>A new timetable named <strong>${name}</strong> has been created for the group ${getGroup.name}.</p>
                      <p>The timetable is valid from ${startDate} to ${endDate}.</p>
                      <p>Please check the system for the complete timetable entries.</p>`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmails, // Send to all users at once
      subject: `New Timetable Created for ${getGroup.name} Group`,
      html: emailBody,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to all users in group: ${getGroup.name}`);
      res.status(201).send({
        status: "success",
        message: "Timetable created, and email sent to all users!",
      });
    } catch (error) {
      console.error(`Error sending email to all users:`, error);
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

module.exports = createTimetable;

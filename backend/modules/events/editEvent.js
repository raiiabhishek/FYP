const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const editEvent = async (req, res) => {
  const EventModel = mongoose.model("Events");
  const UserModel = mongoose.model("Users");

  const {
    title,
    description,
    startDate,
    endDate,
    startTime,
    endTime,
    location,
    allDay,
  } = req.body;
  const { eventId } = req.params;

  try {
    // 1. Find the event to be updated
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .send({ status: "failed", message: "No such event" });
    }
    // 2. Update the event
    const updatedEvent = await EventModel.findByIdAndUpdate(eventId, {
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      allDay,
    });

    // 3. Fetch all users
    const allUsers = await UserModel.find({});

    if (!allUsers || allUsers.length === 0) {
      return res.status(200).send({
        status: "success",
        message: "Event updated, but no users to notify.",
      });
    }

    // 4. Create a single email to all users.
    const userEmails = allUsers.map((user) => user.email);
    const emailBody = `<p>Dear users,</p>
              <p>The event <strong>${title}</strong> has been updated.</p>
               <p><strong>Description:</strong> ${description}</p>
              ${
                allDay
                  ? `<p><strong>Date:</strong> ${startDate}</p>`
                  : `<p><strong>Start Date:</strong> ${startDate}, <strong>Start Time:</strong> ${startTime}</p>
                     <p><strong>End Date:</strong> ${endDate}, <strong>End Time:</strong> ${endTime}</p>`
              }
               <p><strong>Location:</strong> ${location}</p>
               <p>Please check the system for the updated event details.</p>`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmails, // Send to all users at once
      subject: `Event Updated: ${title}`,
      html: emailBody,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to all users.`);
      res.status(201).send({
        status: "success",
        message: "Event updated and email sent to all users!",
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

module.exports = editEvent;

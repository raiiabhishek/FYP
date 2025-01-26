const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const createEvent = async (req, res) => {
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

  try {
    // 1. Create new event
    const newEvent = await EventModel.create({
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      allDay,
    });

    // 2. Fetch all users from database
    const allUsers = await UserModel.find({});

    if (!allUsers || allUsers.length === 0) {
      return res.status(200).send({
        status: "success",
        message: "Event created, but no users to notify",
      });
    }
    // 3. Prepare and send emails to all users
    const emailPromises = allUsers.map(async (user) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `New Event Created: ${title}`,
        html: `<p>Dear ${user.name},</p>
                  <p>A new event <strong>${title}</strong> has been created.</p>
                  <p><strong>Description:</strong> ${description}</p>
                  ${
                    allDay
                      ? `<p><strong>Date:</strong> ${startDate}</p>`
                      : `<p><strong>Start Date:</strong> ${startDate}, <strong>Start Time:</strong> ${startTime}</p>
                        <p><strong>End Date:</strong> ${endDate}, <strong>End Time:</strong> ${endTime}</p> `
                  }
                  <p><strong>Location:</strong> ${location}</p>
                   <p>Please check the system for more details.</p>`,
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
      message: "Event created and emails sent to all users successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(400).send({ status: "failed", message: err.message });
  }
};

module.exports = createEvent;

const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// Reuse the transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const createEvent = async (req, res) => {
  const EventModel = mongoose.model("Events");
  const UserModel = mongoose.model("User");

  const {
    title,
    description,
    startDate,
    endDate,
    startTime,
    endTime,
    location,
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
    });

    // 2. Fetch only email fields from all users
    const allUsers = await UserModel.find({}, { email: 1, _id: 0 });
    const recipientEmails = allUsers.map((user) => user.email);

    if (recipientEmails.length === 0) {
      return res.status(200).send({
        status: "success",
        message: "Event created, but no users to notify",
      });
    }

    // 3. Create a single email message for all users
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmails,
      subject: `New Event Created: ${title}`,
      html: `<p>Dear User,</p>
                  <p>A new event <strong>${title}</strong> has been created.</p>
                  <p><strong>Description:</strong> ${description}</p>
                  ${`<p><strong>Start Date:</strong> ${startDate}, <strong>Start Time:</strong> ${startTime}</p>
                        <p><strong>End Date:</strong> ${endDate}, <strong>End Time:</strong> ${endTime}</p> `}
                  <p><strong>Location:</strong> ${location}</p>
                   <p>Please check the system for more details.</p>`,
    };

    // 4. Send email to all recipients at once
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Email sent to all recipients: ${recipientEmails.join(", ")}`,
      info
    );

    res.status(201).send({
      status: "success",
      message: "Event created and emails sent to all users successfully",
    });
  } catch (err) {
    console.error("Error during event creation or email sending:", err);
    res.status(400).send({ status: "failed", message: err.message });
  }
};

module.exports = createEvent;

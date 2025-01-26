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
    // 4. Send email to each user about event update
    const emailPromises = allUsers.map(async (user) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Event Updated: ${title}`,
        html: `<p>Dear ${user.name},</p>
              <p>The event <strong>${title}</strong> has been updated.</p>
               <p><strong>Description:</strong> ${description}</p>
              ${
                allDay
                  ? `<p><strong>Date:</strong> ${startDate}</p>`
                  : `<p><strong>Start Date:</strong> ${startDate}, <strong>Start Time:</strong> ${startTime}</p>
                     <p><strong>End Date:</strong> ${endDate}, <strong>End Time:</strong> ${endTime}</p>`
              }
               <p><strong>Location:</strong> ${location}</p>
               <p>Please check the system for the updated event details.</p>`,
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
      message: "Event updated and emails sent successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(400).send({ status: "failed", message: err.message });
  }
};

module.exports = editEvent;

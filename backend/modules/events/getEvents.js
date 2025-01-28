const mongoose = require("mongoose");
const getEvents = async (req, res) => {
  const EventModel = mongoose.model("Events");

  try {
    const now = new Date();
    const events = await EventModel.find({
      startDate: { $gte: now.toISOString() },
    }).sort({ startDate: 1 });
    res.status(201).send({ status: "success", data: events });
  } catch (err) {
    res.status(400).send({ status: "failed", message: err.message });
  }
};
module.exports = getEvents;

const mongoose = require("mongoose");
const getEvents = async (req, res) => {
  const EventModel = mongoose.model("Events");

  try {
    const events = await EventModel.find();
    res.status(201).send({ status: "success", data: events });
  } catch (err) {
    res.status(400).send({ status: "failed", message: err.message });
  }
};
module.exports = getEvents;

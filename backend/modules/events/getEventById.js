const mongoose = require("mongoose");
const getEventById = async (req, res) => {
  const EventModel = mongoose.model("Events");
  const { eventId } = req.params;
  try {
    const event = await EventModel.findById(eventId);
    res.status(201).send({ status: "success", data: event });
  } catch (err) {
    res.status(400).send({ status: "failed", message: err.message });
  }
};
module.exports = getEventById;

const mongoose = require("mongoose");
const deleteEvent = async (req, res) => {
  const EventModel = mongoose.model("Events");
  const { eventId } = req.params;
  try {
    const result = await EventModel.findByIdAndDelete(eventId);
    res.status(201).send({ status: "success" });
  } catch (err) {
    res.status(400).send({ status: "failed", message: err.message });
  }
};
module.exports = deleteEvent;

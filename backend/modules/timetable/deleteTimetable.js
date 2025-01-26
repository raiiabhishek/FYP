const mongoose = require("mongoose");
const deleteTimetable = async (req, res) => {
  const TimetableModel = mongoose.model("Timetable");
  const { timetableId } = req.params;
  try {
    const result = await TimetableModel.findByIdAndDelete(timetableId);
    res.status(201).send({ status: "success" });
  } catch (err) {
    res.status(400).send({ status: "failed", message: err.message });
  }
};

module.exports = deleteTimetable;

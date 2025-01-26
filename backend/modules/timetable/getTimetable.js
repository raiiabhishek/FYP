const mongoose = require("mongoose");
const getTimetable = async (req, res) => {
  const TimetableModel = mongoose.model("Timetable");
  try {
    const timetables = await TimetableModel.find()
      .populate({
        path: "group",
        populate: {
          path: "course",
          model: "Courses",
        },
      })
      .populate({
        path: "entries.teacher",
        model: "User",
      })
      .lean();
    res.status(201).send({ status: "success", data: timetables });
  } catch (err) {
    res.status(400).send({ status: "failed", message: err.message });
  }
};

module.exports = getTimetable;

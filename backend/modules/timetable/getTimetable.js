const mongoose = require("mongoose");
const getTimetable = async (req, res) => {
  const TimetableModel = mongoose.model("Timetable");
  try {
    const now = new Date();
    const timetables = await TimetableModel.find({
      endDate: { $gte: now },
    })
      .populate({
        path: "group",
        populate: {
          path: "course",
          model: "Courses",
        },
      })
      .populate({
        path: "entries.module",
        model: "Modules",
      })
      .populate({
        path: "entries.teacher",
        model: "User",
      });
    res.status(201).send({ status: "success", data: timetables });
  } catch (err) {
    res.status(400).send({ status: "failed", message: err.message });
  }
};

module.exports = getTimetable;

const mongoose = require("mongoose");
const getTimetableById = async (req, res) => {
  const TimetableModel = mongoose.model("Timetable");
  const { timetableId } = req.params;
  try {
    const timetable = await TimetableModel.findById(timetableId)
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
    res.status(201).send({ status: "success", data: timetable });
  } catch (err) {
    res.status(400).send({ status: "failed", message: err.message });
  }
};

module.exports = getTimetableById;

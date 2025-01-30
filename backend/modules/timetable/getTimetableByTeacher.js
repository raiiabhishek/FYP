const mongoose = require("mongoose");
const getTimetableByTeacher = async (req, res) => {
  const TimetableModel = mongoose.model("Timetable");
  const UserModel = mongoose.model("User");
  try {
    const userId = req.user._id;
    const now = new Date();
    const timetables = await TimetableModel.find({
      "entries.teacher": userId,
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
    res.status(200).send({ status: "success", data: timetables });
  } catch (e) {
    res.status(400).send({ status: "failed" });
  }
};
module.exports = getTimetableByTeacher;

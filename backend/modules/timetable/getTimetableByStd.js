const mongoose = require("mongoose");
const getTimetableByStd = async (req, res) => {
  const TimetableModel = mongoose.model("Timetable");
  const UserModel = mongoose.model("User");
  try {
    const now = new Date();
    const getUser = await UserModel.findById(req.user._id);
    if (!getUser) throw "no such user";
    const timetables = await TimetableModel.find({
      group: getUser.groups[0],
      endDate: { $gte: now },
    })
      .populate("group")
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
    console.log(e);
    res.status(400).send({ status: "failed" });
  }
};
module.exports = getTimetableByStd;

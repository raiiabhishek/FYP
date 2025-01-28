const mongoose = require("mongoose");

const user = async (req, res) => {
  const now = new Date();
  const UserModel = mongoose.model("User");
  const ModulesModel = mongoose.model("Modules");
  const AnnouncementModel = mongoose.model("Announcements");
  const EventModel = mongoose.model("Events");
  const _id = req.user._id;
  const getUser = await UserModel.findOne({
    _id: _id,
  }).populate("course");
  const getModules = await ModulesModel.find({
    course: getUser.course._id,
  }).populate("course");
  const getAnnouncements = await AnnouncementModel.find({
    course: getUser.course._id,
  }).populate("course");
  const getEvents = await EventModel.find({
    startDate: { $gte: now.toISOString() },
  }).sort({ startDate: 1 });
  res.status(200).send({
    data: getUser,
    modules: getModules,
    announcements: getAnnouncements,
    events: getEvents,
  });
};

module.exports = user;

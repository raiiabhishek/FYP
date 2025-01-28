const mongoose = require("mongoose");
const getAnnouncements = async (req, res) => {
  const AnnouncementModel = mongoose.model("Announcements");
  try {
    const announcements = await AnnouncementModel.find().populate("course");
    res.status(201).send({ status: "success", data: announcements });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
module.exports = getAnnouncements;

const mongoose = require("mongoose");
const delAnnouncement = async (req, res) => {
  const AnnouncementModel = mongoose.model("Announcements");
  const { announcementId } = req.params;
  try {
    const newAnnouncement = await AnnouncementModel.findByIdAndUpdate(
      announcementId
    );
    res.status(201).send({ status: "success" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
module.exports = delAnnouncement;

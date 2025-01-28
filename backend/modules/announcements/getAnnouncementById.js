const mongoose = require("mongoose");
const getAnnouncementById = async (req, res) => {
  const AnnouncementModel = mongoose.model("Announcements");
  const { announcementId } = req.params;
  try {
    const announcement = await AnnouncementModel.findById(
      announcementId
    ).populate("course");
    res.status(201).send({ status: "success", data: announcement });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
module.exports = getAnnouncementById;

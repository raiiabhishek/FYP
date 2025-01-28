const mongoose = require("mongoose");
const getAnnouncementByCourse = async (req, res) => {
  const AnnouncementModel = mongoose.model("Announcements");
  const CourseModel = mongoose.model("Courses");
  const { course } = req.params;
  try {
    const getCourse = await CourseModel.findOne({ name: course });
    if (!getCourse) throw "No such course";
    const announcements = await AnnouncementModel.find({
      course: getCourse._id,
    }).populate("course");
    res.status(201).send({ status: "success", data: announcements });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
module.exports = getAnnouncementByCourse;

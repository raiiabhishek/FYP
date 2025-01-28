const mongoose = require("mongoose");
const createAnnouncement = async (req, res) => {
  const AnnouncementModel = mongoose.model("Announcements");
  const CourseModel = mongoose.model("Courses");
  const { name, description, course } = req.body;
  try {
    const getCourse = await CourseModel.findOne({ name: course });
    if (!getCourse) throw "No such course";
    const newAnnouncement = await AnnouncementModel.create({
      name,
      description,
      course: getCourse._id,
    });
    res.status(201).send({ status: "success" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
module.exports = createAnnouncement;

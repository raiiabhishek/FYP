const mongoose = require("mongoose");
const getCourses = async (req, res) => {
  const CourseModel = mongoose.model("Courses");
  try {
    const courses = await CourseModel.find();
    res.status(200).send({ status: "success", data: courses });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e });
  }
};
module.exports = getCourses;

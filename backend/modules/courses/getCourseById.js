const mongoose = require("mongoose");
const getCourseById = async (req, res) => {
  const CourseModel = mongoose.model("Courses");
  const { courseId } = req.params;
  try {
    const course = await CourseModel.findById(courseId);
    res.status(200).send({ status: "success", data: course });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e });
  }
};
module.exports = getCourseById;

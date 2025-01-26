const mongoose = require("mongoose");
const delCourse = async (req, res) => {
  const CourseModel = mongoose.model("Courses");
  const { courseId } = req.params;
  try {
    const updatedCourse = await CourseModel.findByIdAndDelete(courseId);
    res.status(200).send({ status: "success" });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e });
  }
};
module.exports = delCourse;

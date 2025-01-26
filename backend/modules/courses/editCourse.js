const mongoose = require("mongoose");
const editCourse = async (req, res) => {
  const CourseModel = mongoose.model("Courses");
  const { courseId } = req.params;
  const { name, description } = req.body;
  try {
    const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, {
      name,
      description,
    });
    res.status(200).send({ status: "success", data: updatedCourse });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e });
  }
};
module.exports = editCourse;

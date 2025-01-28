const mongoose = require("mongoose");
const getTeachersByCourse = async (req, res) => {
  const UserModel = mongoose.model("User");
  const CourseModel = mongoose.model("Courses");
  const { course } = req.params;
  try {
    const getCourse = await CourseModel.findOne({ name: course });
    console.log(getCourse);
    if (!getCourse) throw "No such Course";
    const teachers = await UserModel.find({
      course: getCourse._id,
      role: "teacher",
    }).populate("course");
    console.log(teachers);
    res.status(200).send({
      status: "success",
      data: teachers,
    });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e });
  }
};
module.exports = getTeachersByCourse;

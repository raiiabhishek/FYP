const mongoose = require("mongoose");
const getModulesByCourse = async (req, res) => {
  const ModuleModel = mongoose.model("Modules");
  const CourseModel = mongoose.model("Courses");
  const { course } = req.params;
  try {
    const getCourse = await CourseModel.findOne({ name: course });
    console.log(getCourse);
    if (!getCourse) throw "No such Course";
    const modules = await ModuleModel.find({ course: getCourse._id }).populate(
      "course"
    );
    console.log(modules);
    res.status(200).send({
      status: "success",
      data: modules,
    });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e });
  }
};
module.exports = getModulesByCourse;

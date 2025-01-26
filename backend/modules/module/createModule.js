const mongoose = require("mongoose");
const createModule = async (req, res) => {
  const ModuleModel = mongoose.model("Modules");
  const CourseModel = mongoose.model("Courses");
  const { name, description, credit, course } = req.body;
  console.log(course);
  try {
    const getCourse = await CourseModel.findOne({ name: course });
    if (!getCourse) {
      throw "No such course";
    }
    const newModule = await ModuleModel.create({
      name,
      description,
      credit,
      course: getCourse._id,
    });
    res.status(200).send({
      status: "success",
      data: newModule,
    });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e });
  }
};
module.exports = createModule;

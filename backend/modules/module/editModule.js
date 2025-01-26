const mongoose = require("mongoose");
const editModule = async (req, res) => {
  const ModuleModel = mongoose.model("Modules");
  const CourseModel = mongoose.model("Courses");
  const { moduleId } = req.params;
  const { name, description, credit, course } = req.body;
  try {
    if (course) {
      const getCourse = await CourseModel.find({ course });
      if (!getCourse) {
        throw "No such course";
      }
      const updatedModule = await ModuleModel.findByIdAndUpdate(moduleId, {
        name,
        description,
        credit,
        course: getCourse._id,
      });
      res.status(200).send({
        status: "success",
        data: updatedModule,
      });
    } else {
      const updatedModule = await ModuleModel.findByIdAndUpdate(moduleId, {
        name,
        description,
        credit,
      });
      res.status(200).send({
        status: "success",
        data: updatedModule,
      });
    }
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e });
  }
};
module.exports = editModule;

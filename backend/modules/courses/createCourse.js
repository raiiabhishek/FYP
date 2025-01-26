const mongoose = require("mongoose");
const createCourse = async (req, res) => {
  const CourseModel = mongoose.model("Courses");
  const { name, description } = req.body;
  try {
    const newCourse = await CourseModel.create({
      name,
      description,
    });
    res.status(200).send({ status: "success", data: newCourse });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e });
  }
};
module.exports = createCourse;

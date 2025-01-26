const mongoose = require("mongoose");

const createGroup = async (req, res) => {
  const GroupModel = mongoose.model("Groups");
  const CourseModel = mongoose.model("Courses");
  try {
    const { name, course } = req.body;

    if (!name || !course) {
      return res.status(400).json({ message: "Name and course are required" });
    }
    const getCourse = await CourseModel.findOne({ name: course });
    if (!getCourse) {
      throw "No such Course";
    }
    const newGroup = await GroupModel.create({ name, course: getCourse._id });

    res.status(201).send({ status: "success" });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).send({
      status: "failed",
      message: "Failed to create group",
      error: error.message,
    });
  }
};

module.exports = createGroup;

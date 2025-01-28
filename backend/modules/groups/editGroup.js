const mongoose = require("mongoose");
const editGroup = async (req, res) => {
  const GroupModel = mongoose.model("Groups");
  const CourseModel = mongoose.model("Courses");
  try {
    const { groupId } = req.params;
    const { name, course } = req.body;
    console.log("edit group");
    if (!name || !course) {
      return res.status(400).json({ message: "Name and course are required" });
    }
    const getCourse = await CourseModel.find({ name: course });
    if (!getCourse) {
      throw "No such Course";
    }
    const updatedGroup = await GroupModel.findByIdAndUpdate(
      groupId,
      { name, course: getCourse._id },
      { new: true, runValidators: true } // 'new: true' returns updated document
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).send({ status: "success" });
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).send({
      status: "failed",
      message: "Failed to update group",
      error: error.message,
    });
  }
};

module.exports = editGroup;

const mongoose = require("mongoose");
const path = require("path");
const editAssignment = async (req, res) => {
  const AssignmentModule = mongoose.model("Assignments");
  const ModuleModel = mongoose.model("Modules");
  try {
    const { title, description, endDate } = req.body;
    const { moduleId, assignmentId } = req.params;
    let files = [];
    if (req.files && req.files["files"]) {
      files = req.files["files"].map((file) => path.basename(file.path));
    }
    const foundModule = await ModuleModel.findOne({ _id: moduleId });

    if (!foundModule) {
      return res.status(404).send({ message: "module not found" });
    }
    const updatedAssignment = await AssignmentModule.findByIdAndUpdate(
      assignmentId,
      {
        title,
        module: foundModule._id,
        description,
        files,
        endDate,
      }
    );
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
};

module.exports = editAssignment;

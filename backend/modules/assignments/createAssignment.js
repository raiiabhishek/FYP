const mongoose = require("mongoose");
const path = require("path");
const createAssignment = async (req, res) => {
  const AssignmentModule = mongoose.model("Assignments");
  const ModuleModel = mongoose.model("Modules");
  try {
    const { title, description, endDate } = req.body;
    const { moduleId } = req.params;
    let files = [];
    if (req.files && req.files["files"]) {
      files = req.files["files"].map((file) => path.basename(file.path));
    }
    const foundModule = await ModuleModel.findOne({ _id: moduleId });

    if (!foundModule) {
      return res.status(404).send({ message: "module not found" });
    }
    const newAssignment = await AssignmentModule.create({
      title,
      module: foundModule._id,
      description,
      files,
      endDate,
    });
    const updateModule = await ModuleModel.findByIdAndUpdate(moduleId, {
      $push: {
        assignments: newAssignment._id,
      },
    });
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
};

module.exports = createAssignment;

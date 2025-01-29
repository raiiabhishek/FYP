const mongoose = require("mongoose");

const getAssignmentsByModule = async (req, res) => {
  const AssignmentModel = mongoose.model("Assignments");
  const ModuleModel = mongoose.model("Modules");
  const { moduleId } = req.params;

  try {
    const getModule = await ModuleModel.findById(moduleId);
    if (!getModule) throw "No such module";
    const assignments = await AssignmentModel.find({ module: getModule._id })
      .populate("module")
      .populate("submissions");
    res.status(200).send({ status: "success", data: assignments });
  } catch (e) {
    res.status(400).send({ status: "failed" });
  }
};
module.exports = getAssignmentsByModule;

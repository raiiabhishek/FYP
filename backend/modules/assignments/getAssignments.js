const mongoose = require("mongoose");

const getAssignments = async (req, res) => {
  const AssignmentModel = mongoose.model("Assignments");
  const assignments = await AssignmentModel.find()
    .populate("module")
    .populate("submissions");
  res.status(200).send({ status: "success", data: assignments });
};
module.exports = getAssignments;

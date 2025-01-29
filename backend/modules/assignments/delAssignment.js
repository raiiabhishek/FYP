const mongoose = require("mongoose");
const delAssignment = async (req, res) => {
  const AssignmentModel = mongoose.model("Assignments");
  const { assignmentId } = req.params;
  try {
    const result = await AssignmentModel.findByIdAndDelete(assignmentId);
    res.status(200).send({ status: "success" });
  } catch (e) {
    res.status(400).send({ status: "failed" });
  }
};

module.exports = delAssignment;

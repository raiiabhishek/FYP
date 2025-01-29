const mongoose = require("mongoose");
const path = require("path");
const createSubmission = async (req, res) => {
  const AssignmentModel = mongoose.model("Assignments");
  const SubmissionModel = mongoose.model("Submissions");
  try {
    const { remarks } = req.body;
    const { assignmentId } = req.params;
    let files = [];
    if (req.files && req.files["files"]) {
      files = req.files["files"].map((file) => path.basename(file.path));
    }
    const foundAssignment = await AssignmentModel.findOne({
      _id: assignmentId,
    });

    if (!foundAssignment) {
      return res.status(404).send({ message: "assignment not found" });
    }
    const newSubmission = await SubmissionModel.create({
      files,
      user: req.user._id,
      remarks,
    });
    const updateAssignment = await AssignmentModel.findByIdAndUpdate(
      assignmentId,
      {
        $push: {
          submissions: newSubmission._id,
        },
      }
    );
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
};

module.exports = createSubmission;

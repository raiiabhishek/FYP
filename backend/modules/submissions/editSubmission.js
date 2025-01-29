const mongoose = require("mongoose");
const path = require("path");
const editSubmission = async (req, res) => {
  const AssignmentModule = mongoose.model("Assignments");
  const SubmissionModel = mongoose.model("Submissions");
  try {
    const { remarks } = req.body;
    const { assignmentId, submissionId } = req.params;
    let files = [];
    if (req.files && req.files["files"]) {
      files = req.files["files"].map((file) => path.basename(file.path));
    }
    const foundAssignment = await AssignmentModule.findOne({
      _id: assignmentId,
    });

    if (!foundAssignment) {
      return res.status(404).send({ message: "assignment not found" });
    }
    const updateSubmission = await SubmissionModel.findByIdAndUpdate(
      submissionId,
      {
        files,
        user: req.user._id,
        remarks,
      }
    );
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
};

module.exports = editSubmission;

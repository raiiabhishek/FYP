const mongoose = require("mongoose");

const delSubmission = async (req, res) => {
  const SubmissionModel = mongoose.model("Submissions");
  const { submissionId } = req.params;
  try {
    const result = await SubmissionModel.findByIdAndDelete(submissionId);
    res.status(200).send({ status: "success" });
  } catch (e) {
    res.status(400).send({ status: "failed" });
  }
};
module.exports = delSubmission;

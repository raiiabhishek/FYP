const mongoose = require("mongoose");
const getSubmissionById = async (req, res) => {
  const SubmissionModel = mongoose.model("Submissions");
  const { submissionId } = req.params;
  const submission = await SubmissionModel.findById(submissionId).populate(
    "user"
  );
  res.status(200).send({ status: "success", data: submission });
};
module.exports = getSubmissionById;

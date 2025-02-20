const mongoose = require("mongoose");
const editResult = async (req, res) => {
  const ResultModel = mongoose.model("Results");
  const { resultId } = req.params;
  const { studentId, obtainedGrade } = req.body;
  try {
    const updateResult = await ResultModel.findByIdAndUpdate(resultId, {
      student: studentId,
      obtainedGrade,
    });
    res.status(200).send({ status: "success" });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e.msg });
  }
};
module.exports = editResult;

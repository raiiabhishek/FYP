const mongoose = require("mongoose");
const getResultByStd = async (req, res) => {
  const ResultModel = mongoose.model("Results");
  const { moduleId, studentId } = req.params;
  try {
    const result = await ResultModel.find({
      student: studentId,
      module: moduleId,
    })
      .populate("module")
      .populate("student");
    res.status(200).send({ status: "succes", data: result });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e.msg });
  }
};
module.exports = getResultByStd;

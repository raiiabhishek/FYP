const mongoose = require("mongoose");
const delResult = async (req, res) => {
  const ResultModel = mongoose.model("Results");
  const { resultId } = req.params;
  try {
    const updateResult = await ResultModel.findByIdAndDelete(resultId);
    res.status(200).send({ status: "success" });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e.msg });
  }
};
module.exports = delResult;

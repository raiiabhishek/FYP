const mongoose = require("mongoose");
const getResultByModule = async (req, res) => {
  const ResultModel = mongoose.model("Results");
  const { moduleId } = req.params;
  try {
    console.log(moduleId);
    const result = await ResultModel.find({
      module: moduleId,
    })
      .populate("module")
      .populate("student");
    if (!result) {
      res.status(200).send({ status: "success", data: "No result found" });
    }
    res.status(200).send({ status: "success", data: result });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e.message });
  }
};
module.exports = getResultByModule;

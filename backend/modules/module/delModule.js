const mongoose = require("mongoose");
const delModule = async (req, res) => {
  const ModuleModel = mongoose.model("Modules");
  const { moduleId } = req.params;
  try {
    const ressult = await ModuleModel.findByIdAndDelete(moduleId);
    res.status(200).send({
      status: "success",
    });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e });
  }
};
module.exports = delModule;

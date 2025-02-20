const mongoose = require("mongoose");
const getModules = async (req, res) => {
  const ModuleModel = mongoose.model("Modules");
  try {
    const modules = await ModuleModel.find()
      .populate("course")
      .populate({
        path: "assignments",
        populate: {
          path: "submissions",
          model: "Submissions",
          populate: {
            path: "user",
            model: "User",
          },
        },
      });
    console.log(modules);
    res.status(200).send({
      status: "success",
      data: modules,
    });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e });
  }
};
module.exports = getModules;

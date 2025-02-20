const mongoose = require("mongoose");
const createResult = async (req, res) => {
  const ResultModel = mongoose.model("Results");
  const UserModel = mongoose.model("User");
  const { student, moduleId, obtainedGrade } = req.body;
  try {
    console.log(student);
    const std = await UserModel.findOne({ name: student });
    const newResult = await ResultModel.create({
      student: std._id,
      module: moduleId,
      obtainedGrade,
    });
    console.log(newResult);
    res.status(200).send({ status: "success" });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e.msg });
  }
};
module.exports = createResult;

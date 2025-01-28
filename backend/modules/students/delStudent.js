const mongoose = require("mongoose");

const delStudent = async (req, res) => {
  const UserModel = mongoose.model("User");
  const { studentId } = req.params;
  try {
    const result = await UserModel.findByIdAndDelete(studentId);
    res.status(400).send({ status: "success" });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e });
  }
};
module.exports = delStudent;

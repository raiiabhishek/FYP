const mongoose = require("mongoose");

const delTeacher = async (req, res) => {
  const UserModel = mongoose.model("User");
  const { teacherId } = req.params;
  try {
    const result = await UserModel.findByIdAndDelete(teacherId);
    res.status(400).send({ status: "success" });
  } catch (e) {
    res.status(400).send({ status: "failed", msg: e });
  }
};
module.exports = delTeacher;

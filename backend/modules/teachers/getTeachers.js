const mongoose = require("mongoose");
const getTeachers = async (req, res) => {
  const UserModel = mongoose.model("User");
  const teachers = await UserModel.find({ role: "teacher" }).populate("course");
  console.log(teachers);
  res.status(200).send({ status: "success", data: teachers });
};
module.exports = getTeachers;

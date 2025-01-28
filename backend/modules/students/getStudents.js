const mongoose = require("mongoose");

const getStudents = async (req, res) => {
  const UserModel = mongoose.model("User");
  try {
    const students = await UserModel.find({ role: "student" })
      .populate("course")
      .populate({
        path: "groups",
        model: "Groups",
      })
      .exec();

    console.log(students);
    res.status(200).send({ status: "success", data: students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

module.exports = getStudents;

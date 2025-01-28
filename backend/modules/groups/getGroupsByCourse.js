const mongoose = require("mongoose");

const getGroupsByCourse = async (req, res) => {
  const GroupModel = mongoose.model("Groups");
  const UserModel = mongoose.model("User");
  try {
    const user = await UserModel.findById(req.user._id).populate("course");
    const groups = await GroupModel.find({
      course: user.course._id,
    }).populate("course");
    console.log(groups);
    res.status(200).send({ status: "success", data: groups });
  } catch (error) {
    console.error("Error getting groups:", error);
    res.status(500).send({
      status: "failed",
      message: "Failed to get groups",
      error: error.message,
    });
  }
};

module.exports = getGroupsByCourse;

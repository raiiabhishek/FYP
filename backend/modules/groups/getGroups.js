const mongoose = require("mongoose");

const getGroups = async (req, res) => {
  const GroupModel = mongoose.model("Groups");
  try {
    const groups = await GroupModel.find().populate("course");
    res.status(200).send({ status: "success", data: groups });
  } catch (error) {
    console.error("Error getting groups:", error);
    res
      .status(500)
      .send({
        status: "failed",
        message: "Failed to get groups",
        error: error.message,
      });
  }
};

module.exports = getGroups;

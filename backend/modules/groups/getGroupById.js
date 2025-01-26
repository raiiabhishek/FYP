const mongoose = require("mongoose");

const getGroupById = async (req, res) => {
  const GroupModel = mongoose.model("Groups");
  try {
    const { groupId } = req.params;
    const group = await GroupModel.findById(groupId).populate("course");
    if (!group) {
      return res
        .status(404)
        .send({ status: "failed", message: "Group not found" });
    }
    res.status(200).send({ status: "success", data: group });
  } catch (error) {
    console.error("Error getting group by ID:", error);
    res.status(500).send({
      status: "failed",
      message: "Failed to get group by ID",
      error: error.message,
    });
  }
};

module.exports = getGroupById;

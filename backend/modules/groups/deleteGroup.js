const mongoose = require("mongoose");
const deleteGroup = async (req, res) => {
  const GroupModel = mongoose.model("Groups");
  try {
    const { groupId } = req.params;

    const deletedGroup = await GroupModel.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return res
        .status(404)
        .send({ status: "failed", message: "Group not found" });
    }

    res
      .status(200)
      .send({ status: "success", message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).send({
      status: "failed",
      message: "Failed to delete group",
      error: error.message,
    });
  }
};

module.exports = deleteGroup;

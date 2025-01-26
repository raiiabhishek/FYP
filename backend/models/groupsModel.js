const mongoose = require("mongoose");
const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
  },
});

const groupModel = mongoose.model("Groups", groupSchema);

module.exports = groupModel;

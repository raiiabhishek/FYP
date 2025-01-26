const mongoose = require("mongoose");
const moduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  description: {
    type: String,
  },
  credit: {
    type: Number,
    required: [true, "Credit is required"],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
  },
});

const moduleModel = mongoose.model("Modules", moduleSchema);

module.exports = moduleModel;

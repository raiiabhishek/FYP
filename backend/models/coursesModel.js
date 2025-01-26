const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  description: {
    type: String,
  },
});

const courseModel = mongoose.model("Courses", courseSchema);

module.exports = courseModel;

const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "modules",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    files: {
      type: [String],
    },
    submissions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "submissions",
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const assignmentModel = mongoose.model("Assignments", assignmentSchema);

module.exports = assignmentModel;

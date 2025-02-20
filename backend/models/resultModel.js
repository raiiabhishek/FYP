const mongoose = require("mongoose");
const { Schema } = mongoose;

const resultSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    module: {
      type: Schema.Types.ObjectId,
      ref: "Modules",
      required: true,
    },
    fullMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    obtainedGrade: {
      type: Number,
      required: true,
    },
    passingGrade: {
      type: Number,
      required: true,
      default: 35,
    },
  },
  { timestamps: true }
);

const Result = mongoose.model("Results", resultSchema);

module.exports = Result;

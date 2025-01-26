const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Modules",
    required: true,
  },
  examDate: { type: Date, required: true },
  name: { type: String, required: true },
});

const Exam = mongoose.model("Exams", examSchema);
module.exports = Exam;

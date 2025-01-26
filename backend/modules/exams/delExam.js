const mongoose = require("mongoose");

const delExam = async (req, res) => {
  const ExamModel = mongoose.model("Exams");
  const { examId } = req.params;
  try {
    const result = await ExamModel.findByIdAndDelete(examId);
    res.status(201).send({ status: "success" });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
};
module.exports = delExam;

const mongoose = require("mongoose");

const getExamById = async (req, res) => {
  const ExamModel = mongoose.model("Exams");
  const { examId } = req.params;
  try {
    const exam = await ExamModel.find(examId).populate({
      path: "module",
      populate: {
        path: "course",
        ref: "Courses",
      },
    });
    res.status(201).send({ status: "success", data: exam });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
};
module.exports = getExamById;

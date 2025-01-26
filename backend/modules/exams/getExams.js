const mongoose = require("mongoose");

const getExams = async (req, res) => {
  const ExamModel = mongoose.model("Exams");
  try {
    const exams = await ExamModel.find().populate({
      path: "module",
      populate: {
        path: "course",
        ref: "Courses",
      },
    });
    res.status(201).send({ status: "success", data: exams });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
};
module.exports = getExams;

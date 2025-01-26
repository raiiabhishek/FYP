const mongoose = require("mongoose");

const editExam = async (req, res) => {
  const ExamModel = mongoose.model("Exams");
  const ModuleModel = mongoose.model("Modules");
  const { examId } = req.params;
  const { module, examDate, name } = req.body;
  try {
    const getModule = await ModuleModel.find({ name: module });
    const updated = await ExamModel.findByIdAndUpdate(examId, {
      module: getModule._id,
      examDate,
      name,
    });
    res.status(201).send({ status: "success" });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
};
module.exports = editExam;

const mongoose = require("mongoose");

const getExamByCourse = async (req, res) => {
  const ExamModel = mongoose.model("Exams");
  const ModuleModel = mongoose.model("Modules");
  const CourseModel = mongoose.model("Courses");
  const { course } = req.params;

  try {
    const getCourse = await CourseModel.findOne({ name: course });
    const modules = await ModuleModel.find({ course: getCourse._id });
    if (!modules || modules.length === 0) {
      return res.status(404).send({
        status: "failed",
        message: "No modules found for this course",
      });
    }
    const moduleIds = modules.map((module) => module._id);
    const now = new Date();
    const exams = await ExamModel.find({
      module: { $in: moduleIds },
      examDate: { $gte: now.toISOString() },
    })
      .sort({ examDate: 1 })
      .populate({
        path: "module",
      });

    res.status(200).send({ status: "success", data: exams });
  } catch (error) {
    console.error("Error fetching exams:", error);
    res
      .status(500)
      .send({ status: "failed", message: "Internal server error" });
  }
};

module.exports = getExamByCourse;

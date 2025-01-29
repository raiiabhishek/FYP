const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    files: {
      type: [String],
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

const submissionModel = mongoose.model("Submissions", submissionSchema);
module.exports = submissionModel;

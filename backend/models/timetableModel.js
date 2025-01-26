const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timetableSchema = new Schema({
  name: { type: String, required: true }, // e.g., "Class 10 Timetable", "Faculty Timetable"
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Groups" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  entries: [
    {
      dayOfWeek: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        required: true,
      },
      startTime: { type: String, required: true }, // e.g., "09:00"
      endTime: { type: String, required: true }, // e.g., "10:00"
      subject: String, // Or ref to Subjects collection
      teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the teacher
      classRoom: { type: String }, // Room Number/Name (optional)
      // add other fields depending on your use case
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;

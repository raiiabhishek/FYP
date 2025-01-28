const mongoose = require("mongoose");
const { Schema } = mongoose;

const announcementSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
});

const Announcement = mongoose.model("Announcements", announcementSchema);

module.exports = Announcement;

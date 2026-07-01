const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    examAttemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamAttempt",
      required: true,
    },

    eventType: {
      type: String,
      enum: [
        "WINDOW_SWITCH",
        "PHONE_DETECTED",
        "SPEECH_DETECTED",
        "FOCUS_LOST",
        "CAMERA_OFF",
        "TAB_CHANGE",
        "OTHER",
      ],
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);

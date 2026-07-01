const mongoose = require("mongoose");

const examAttemptSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    status: {
      type: String,
      enum: ["assigned", "in_progress", "submitted"],
      default: "assigned",
    },

    startedAt: {
      type: Date,
    },

    submittedAt: {
      type: Date,
    },

    expiresAt: {
      type: Date,
    },

    score: {
      type: Number,
      default: 0,
    },

    totalMarks: {
      type: Number,
      default: 0,
    },

    passed: {
      type: Boolean,
      default: false,
    },

    violationCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

examAttemptSchema.index({ studentId: 1, examId: 1 }, { unique: true });

module.exports = mongoose.model("ExamAttempt", examAttemptSchema);

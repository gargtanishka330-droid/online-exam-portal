const mongoose = require("mongoose");

const questionBankSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    questionType: {
      type: String,
      enum: ["MCQ", "TRUE_FALSE", "SHORT_ANSWER"],
      default: "MCQ",
    },

    options: [
      {
        type: String,
      },
    ],

    correctAnswer: {
      type: String,
      required: true,
    },

    marks: {
      type: Number,
      required: true,
      default: 1,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("QuestionBank", questionBankSchema);
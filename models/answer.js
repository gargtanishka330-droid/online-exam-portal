const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
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

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionBank",
      required: true,
    },

    selectedAnswer: {
      type: String,
      required: true,
      trim: true,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    marksAwarded: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


answerSchema.index(
  {
    studentId: 1,
    examId: 1,
    questionId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Answer", answerSchema);
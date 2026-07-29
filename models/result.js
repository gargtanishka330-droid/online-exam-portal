const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },

        selectedAnswer: {
          type: String,
        },

        correctAnswer: {
          type: String,
        },

        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],

    totalMarks: {
      type: Number,
      required: true,
    },

    obtainedMarks: {
      type: Number,
      required: true,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Pass", "Fail"],
      default: "Fail",
    },

    timeTaken: {
      type: Number, // minutes
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Result", resultSchema);
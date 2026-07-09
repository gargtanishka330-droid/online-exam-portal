const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // Company/Job belong to an external system — no local models, so plain ids
    company: {
      type: mongoose.Schema.Types.ObjectId,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
    },

    duration: {
      type: Number, // Duration in minutes
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    passingMarks: {
      type: Number,
      required: true,
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuestionBank",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exam", examSchema);
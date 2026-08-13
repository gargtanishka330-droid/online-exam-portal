const mongoose = require("mongoose");

const dailyLoginSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    loginDate: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Same student ko same day dobara count nahi karega
dailyLoginSchema.index(
  { studentId: 1, loginDate: 1 },
  { unique: true }
);

module.exports = mongoose.model("DailyLogin", dailyLoginSchema);
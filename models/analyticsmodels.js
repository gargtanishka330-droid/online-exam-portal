const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    event_name: {
      type: String,
      required: true,
      trim: true,
    },

    event_type: {
      type: String,
      enum: ["impression", "action"],
      required: true,
    },

    user_id: {
      type: String,
      required: true,
    },

    screen: {
      type: String,
      default: "",
    },

    file_type: {
      type: String,
      default: "",
    },

    metadata: {
      type: Object,
      default: {},
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analytics", analyticsSchema);
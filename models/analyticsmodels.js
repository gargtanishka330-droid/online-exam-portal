const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
    },

    eventType: {
      type: String,
      enum: ["impression", "action"],
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    screen: {
      type: String,
      default: "",
    },

    fileType: {
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
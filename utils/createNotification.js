const Notification = require("../models/notification");

const createNotification = async (studentId, { title, message, type = "general" }) => {
  try {
    return await Notification.create({
      studentId,
      title,
      message,
      type,
    });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
    return null;
  }
};

module.exports = createNotification;

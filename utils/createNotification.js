const Notification = require("../models/notification");

const createNotification = async (studentId, { title, message, type = "general" }) => {
  return Notification.create({
    studentId,
    title,
    message,
    type,
  });
};

module.exports = createNotification;

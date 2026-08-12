const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markAsRead,
  getUnreadCount,
} = require("../controllers/notificationcontroller");

const { verifyStudent } = require("../middleware/auth");

router.get("/", verifyStudent, getNotifications);

router.get("/unread-count", verifyStudent, getUnreadCount);

router.patch("/:id/read", verifyStudent, markAsRead);

module.exports = router;

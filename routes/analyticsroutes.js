const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getImpressions,
  getActions,
  getDashboard,
  deleteEvent,
} = require("../controllers/analyticscontroller");

// Create Analytics Event
router.post("/event", createEvent);

// Get All Events
router.get("/", getAllEvents);

// Get Impression Events
router.get("/impressions", getImpressions);

// Get Action Events
router.get("/actions", getActions);

// Analytics Dashboard
router.get("/dashboard", getDashboard);

// Delete Event
router.delete("/:id", deleteEvent);

module.exports = router;
const Analytics = require("../models/analyticsmodels");

// Create Analytics Event
const createEvent = async (req, res) => {
  try {
    const event = await Analytics.create(req.body);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Analytics.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Impression Events
const getImpressions = async (req, res) => {
  try {
    const events = await Analytics.find({ eventType: "impression" });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Action Events
const getActions = async (req, res) => {
  try {
    const events = await Analytics.find({ eventType: "action" });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Dashboard
const getDashboard = async (req, res) => {
  try {
    const totalEvents = await Analytics.countDocuments();
    const impressions = await Analytics.countDocuments({
      eventType: "impression",
    });
    const actions = await Analytics.countDocuments({
      eventType: "action",
    });

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        impressions,
        actions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const event = await Analytics.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getImpressions,
  getActions,
  getDashboard,
  deleteEvent,
};
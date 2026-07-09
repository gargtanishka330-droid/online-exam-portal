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

const { verifyAdmin } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics Management APIs
 */

/**
 * @swagger
 * /api/analytics/event:
 *   post:
 *     summary: Create a new analytics event
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventType:
 *                 type: string
 *                 example: impression
 *               screen:
 *                 type: string
 *                 example: Home
 *               userId:
 *                 type: string
 *                 example: user123
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post("/event", createEvent);

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get all analytics events
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: List of all analytics events
 */
router.get("/", verifyAdmin, getAllEvents);

/**
 * @swagger
 * /api/analytics/impressions:
 *   get:
 *     summary: Get all impression events
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: List of impression events
 */
router.get("/impressions", verifyAdmin, getImpressions);

/**
 * @swagger
 * /api/analytics/actions:
 *   get:
 *     summary: Get all action events
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: List of action events
 */
router.get("/actions", verifyAdmin, getActions);

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get analytics dashboard
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get("/dashboard", verifyAdmin, getDashboard);

/**
 * @swagger
 * /api/analytics/{id}:
 *   delete:
 *     summary: Delete an analytics event
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete("/:id", verifyAdmin, deleteEvent);

module.exports = router;
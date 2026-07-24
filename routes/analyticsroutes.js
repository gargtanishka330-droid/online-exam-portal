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
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventName
 *               - eventType
 *               - userId
 *             properties:
 *               eventName:
 *                 type: string
 *                 example: Home Screen Opened
 *               eventType:
 *                 type: string
 *                 enum:
 *                   - impression
 *                   - action
 *                 example: impression
 *               userId:
 *                 type: string
 *                 example: user123
 *               screen:
 *                 type: string
 *                 example: Home
 *               fileType:
 *                 type: string
 *                 example: pdf
 *               metadata:
 *                 type: object
 *                 example:
 *                   browser: Chrome
 *                   os: Windows
 *     responses:
 *       201:
 *         description: Event created successfully
 *       500:
 *         description: Internal Server Error
 */
router.post("/event", createEvent);

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get all analytics events
 *     tags: [Analytics]
 *     security: []
 *     responses:
 *       200:
 *         description: List of all analytics events
 */
router.get("/", getAllEvents);

/**
 * @swagger
 * /api/analytics/impressions:
 *   get:
 *     summary: Get all impression events
 *     tags: [Analytics]
 *     security: []
 *     responses:
 *       200:
 *         description: List of impression events
 */
router.get("/impressions", getImpressions);

/**
 * @swagger
 * /api/analytics/actions:
 *   get:
 *     summary: Get all action events
 *     tags: [Analytics]
 *     security: []
 *     responses:
 *       200:
 *         description: List of action events
 */
router.get("/actions", getActions);

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get analytics dashboard
 *     tags: [Analytics]
 *     security: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get("/dashboard", getDashboard);

/**
 * @swagger
 * /api/analytics/{id}:
 *   delete:
 *     summary: Delete an analytics event
 *     tags: [Analytics]
 *     security: []
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
router.delete("/:id", deleteEvent);

module.exports = router;
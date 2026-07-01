const express = require("express");
const router = express.Router();

const {
  registerStudent,
  loginStudent,
  getProfile,
  updateProfile,
  getAssessment,
  startAssessment,
  logActivity,
  submitAssessment,
  getResult,
} = require("../controllers/usercontroller");

const { verifyStudent } = require("../middleware/auth");

// =========================
// Public Routes
// =========================

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register Student
 *     tags:
 *       - Student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tanishka
 *               email:
 *                 type: string
 *                 example: student@gmail.com
 *               password:
 *                 type: string
 *                 example: student123
 *     responses:
 *       201:
 *         description: Student registered successfully
 *       400:
 *         description: Student already exists
 */
router.post("/register", registerStudent);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Student Login
 *     tags:
 *       - Student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: student@gmail.com
 *               password:
 *                 type: string
 *                 example: student123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginStudent);

// =========================
// Profile Routes
// =========================

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get Student Profile
 *     tags:
 *       - Student
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", verifyStudent, getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update Student Profile
 *     tags:
 *       - Student
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put("/profile", verifyStudent, updateProfile);

// =========================
// Assessment Routes
// =========================

/**
 * @swagger
 * /api/user/assessment:
 *   get:
 *     summary: Get Assessment
 *     tags:
 *       - Assessment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assessment fetched successfully
 */
router.get("/assessment", verifyStudent, getAssessment);

/**
 * @swagger
 * /api/user/assessment/start:
 *   post:
 *     summary: Start Assessment
 *     tags:
 *       - Assessment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assessment started successfully
 */
router.post("/assessment/start", verifyStudent, startAssessment);

/**
 * @swagger
 * /api/user/assessment/submit:
 *   post:
 *     summary: Submit Assessment
 *     tags:
 *       - Assessment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Assessment submitted successfully
 */
router.post("/assessment/submit", verifyStudent, submitAssessment);

/**
 * @swagger
 * /api/user/assessment/result:
 *   get:
 *     summary: Get Assessment Result
 *     tags:
 *       - Assessment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assessment result fetched successfully
 */
router.get("/assessment/result", verifyStudent, getResult);

// =========================
// Activity Route
// =========================

/**
 * @swagger
 * /api/user/activity:
 *   post:
 *     summary: Log Student Activity
 *     tags:
 *       - Activity
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Activity logged successfully
 */
router.post("/activity", verifyStudent, logActivity);

module.exports = router;
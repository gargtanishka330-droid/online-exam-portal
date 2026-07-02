const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getProfile,
  changePassword,
} = require("../controllers/admincontroller");

const {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
} = require("../controllers/examcontroller");

const {
  addQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionBankcontroller");

const {
  submitAnswer,
  getAllAnswers,
  getAnswerById,
  deleteAnswer,
} = require("../controllers/answercontroller");

const { verifyAdmin } = require("../middleware/auth");

// =========================
// Public Routes
// =========================

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tanishka
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad Request
 */
router.post("/register", registerAdmin);

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin Login
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginAdmin);

// =========================
// Admin Profile
// =========================

router.get("/profile", verifyAdmin, getProfile);
router.put("/change-password", verifyAdmin, changePassword);

// =========================
// Exam Routes
// =========================

router.post("/exam", verifyAdmin, createExam);
router.get("/exam", verifyAdmin, getAllExams);
router.get("/exam/:id", verifyAdmin, getExamById);
router.put("/exam/:id", verifyAdmin, updateExam);
router.delete("/exam/:id", verifyAdmin, deleteExam);

// =========================
// Question Bank Routes
// =========================

router.post("/question", verifyAdmin, addQuestion);
router.get("/question", verifyAdmin, getAllQuestions);
router.get("/question/:id", verifyAdmin, getQuestionById);
router.put("/question/:id", verifyAdmin, updateQuestion);
router.delete("/question/:id", verifyAdmin, deleteQuestion);

// =========================
// Answer Routes
// =========================

router.post("/answer", verifyAdmin, submitAnswer);
router.get("/answer", verifyAdmin, getAllAnswers);
router.get("/answer/:id", verifyAdmin, getAnswerById);
router.delete("/answer/:id", verifyAdmin, deleteAnswer);

module.exports = router;
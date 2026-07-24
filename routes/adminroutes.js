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

const {
  createCompany,
  getAllCompanies,
} = require("../controllers/companycontroller");

const {
  createJob,
  getAllJobs,
} = require("../controllers/jobcontroller");

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
 *     security: []
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
 *     security: []
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
// Company Routes
// =========================

/**
 * @swagger
 * /api/admin/company:
 *   post:
 *     summary: Create a company
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: TechCorp
 *               description:
 *                 type: string
 *                 example: IT services company
 *     responses:
 *       201:
 *         description: Company created successfully
 *   get:
 *     summary: Get all companies
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies
 */
router.post("/company", verifyAdmin, createCompany);
router.get("/company", verifyAdmin, getAllCompanies);

// =========================
// Job Routes
// =========================

/**
 * @swagger
 * /api/admin/job:
 *   post:
 *     summary: Create a job
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, company]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Frontend Developer
 *               company:
 *                 type: string
 *                 description: Company ID from POST /api/admin/company
 *                 example: 507f1f77bcf86cd799439011
 *               description:
 *                 type: string
 *                 example: React/Angular role
 *     responses:
 *       201:
 *         description: Job created successfully
 *   get:
 *     summary: Get all jobs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.post("/job", verifyAdmin, createJob);
router.get("/job", verifyAdmin, getAllJobs);

// =========================
// Exam Routes
// =========================

/**
 * @swagger
 * /api/admin/exam:
 *   post:
 *     summary: Create an exam
 *     tags: [Exam]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, company, job, duration, totalMarks, passingMarks]
 *             properties:
 *               title:
 *                 type: string
 *                 example: JavaScript Assessment
 *               description:
 *                 type: string
 *                 example: Basic JS test
 *               company:
 *                 type: string
 *                 description: Company ID
 *               job:
 *                 type: string
 *                 description: Job ID
 *               duration:
 *                 type: number
 *                 example: 60
 *               totalMarks:
 *                 type: number
 *                 example: 30
 *               passingMarks:
 *                 type: number
 *                 example: 15
 *     responses:
 *       201:
 *         description: Exam created successfully
 *   get:
 *     summary: Get all exams
 *     tags: [Exam]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of exams
 */
router.post("/exam", verifyAdmin, createExam);
router.get("/exam", verifyAdmin, getAllExams);
router.get("/exam/:id", verifyAdmin, getExamById);
router.put("/exam/:id", verifyAdmin, updateExam);
router.delete("/exam/:id", verifyAdmin, deleteExam);

// =========================
// Question Bank Routes
// =========================

/**
 * @swagger
 * /api/admin/question:
 *   post:
 *     summary: Add a question to an exam
 *     tags: [Exam]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [examId, question, correctAnswer, marks]
 *             properties:
 *               examId:
 *                 type: string
 *                 description: Exam ID
 *               question:
 *                 type: string
 *                 example: What is 2 + 2?
 *               questionType:
 *                 type: string
 *                 enum: [MCQ, TRUE_FALSE, SHORT_ANSWER]
 *                 example: MCQ
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["3", "4", "5"]
 *               correctAnswer:
 *                 type: string
 *                 example: "4"
 *               marks:
 *                 type: number
 *                 example: 10
 *               difficulty:
 *                 type: string
 *                 enum: [Easy, Medium, Hard]
 *                 example: Easy
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Question added successfully
 */
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
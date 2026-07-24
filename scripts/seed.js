require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Admin = require("../models/admin");
const Student = require("../models/student");
const Company = require("../models/company");
const Job = require("../models/job");
const Exam = require("../models/exam");
const QuestionBank = require("../models/questionbank");

const seed = async () => {
  await connectDB();

  await Promise.all([
    Company.deleteMany({}),
    Job.deleteMany({}),
    Exam.deleteMany({}),
    QuestionBank.deleteMany({}),
  ]);

  const company = await Company.create({
    name: "TechCorp",
    description: "Sample company for exam portal",
  });

  const job = await Job.create({
    title: "Frontend Developer",
    company: company._id,
    description: "React/Angular developer role",
  });

  const exam = await Exam.create({
    title: "JavaScript Assessment",
    description: "Basic JavaScript and web fundamentals",
    company: company._id,
    job: job._id,
    duration: 60,
    totalMarks: 30,
    passingMarks: 15,
  });

  await QuestionBank.insertMany([
    {
      examId: exam._id,
      question: "What is the output of typeof null in JavaScript?",
      questionType: "MCQ",
      options: ["object", "null", "undefined", "number"],
      correctAnswer: "object",
      marks: 10,
      difficulty: "Easy",
      isActive: true,
    },
    {
      examId: exam._id,
      question: "JavaScript is a statically typed language.",
      questionType: "TRUE_FALSE",
      options: ["True", "False"],
      correctAnswer: "False",
      marks: 10,
      difficulty: "Easy",
      isActive: true,
    },
    {
      examId: exam._id,
      question: "Which keyword declares a block-scoped variable?",
      questionType: "MCQ",
      options: ["var", "let", "function", "class"],
      correctAnswer: "let",
      marks: 10,
      difficulty: "Medium",
      isActive: true,
    },
  ]);

  let admin = await Admin.findOne({ email: "admin@gmail.com" });
  if (!admin) {
    admin = await Admin.create({
      email: "admin@gmail.com",
      password: "admin123",
    });
  }

  let student = await Student.findOne({ email: "student@gmail.com" });
  if (!student) {
    student = await Student.create({
      email: "student@gmail.com",
      password: "student123",
    });
  }

  console.log("Seed completed successfully");
  console.log("Admin login: admin@gmail.com / admin123");
  console.log("Student login: student@gmail.com / student123");
  console.log("Company ID:", company._id.toString());
  console.log("Job ID:", job._id.toString());
  console.log("Exam ID:", exam._id.toString());

  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});

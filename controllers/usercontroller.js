const Student = require("../models/student");
const Exam = require("../models/exam");
const QuestionBank = require("../models/questionbank");
const ExamAttempt = require("../models/examattempt");
const Answer = require("../models/answer");
const ActivityLog = require("../models/activitylog");
const jwt = require("jsonwebtoken");

const isProfileComplete = (student) => {
  return (
    student.fullName &&
    student.skills?.length > 0 &&
    student.education?.degree &&
    student.education?.marks != null
  );
};

const assignExamToStudent = async (student) => {
  const exam = await Exam.findOne().sort({ createdAt: -1 });

  if (!exam) {
    return null;
  }

  student.assignedExamId = exam._id;
  await student.save();

  await ExamAttempt.findOneAndUpdate(
    { studentId: student._id, examId: exam._id },
    { studentId: student._id, examId: exam._id, status: "assigned" },
    { upsert: true, new: true }
  );

  return exam;
};

const stripCorrectAnswers = (questions) => {
  return questions.map((q) => ({
    _id: q._id,
    question: q.question,
    questionType: q.questionType,
    options: q.options,
    marks: q.marks,
    difficulty: q.difficulty,
  }));
};

const gradeAnswer = (question, selectedAnswer) => {
  const isCorrect =
    question.correctAnswer.trim().toLowerCase() ===
    selectedAnswer.trim().toLowerCase();

  return {
    isCorrect,
    marksAwarded: isCorrect ? question.marks : 0,
  };
};

// Register Student
exports.registerStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await Student.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    const student = await Student.create({ email, password });

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: {
        id: student._id,
        email: student.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login Student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.status !== 1) {
      return res.status(403).json({
        success: false,
        message: "Student account is inactive",
      });
    }

    const isMatch = await student.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
        role: "student",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: {
        id: student._id,
        email: student.email,
        fullName: student.fullName,
        profileComplete: student.profileComplete,
        assignedExamId: student.assignedExamId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id)
      .select("-password")
      .populate("assignedExamId", "title description duration totalMarks passingMarks");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Profile — when complete, auto-assign exam
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, skills, education } = req.body;

    const student = await Student.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (fullName) student.fullName = fullName;
    if (phone) student.phone = phone;
    if (skills) student.skills = skills;
    if (education) {
      student.education = { ...student.education?.toObject?.() ?? student.education, ...education };
    }

    const complete = isProfileComplete(student);
    student.profileComplete = complete;

    await student.save();

    let assignedExam = null;

    if (complete && !student.assignedExamId) {
      assignedExam = await assignExamToStudent(student);
    }

    res.status(200).json({
      success: true,
      message: complete
        ? "Profile completed. Assessment assigned."
        : "Profile updated. Please complete all required fields.",
      data: {
        id: student._id,
        fullName: student.fullName,
        phone: student.phone,
        skills: student.skills,
        education: student.education,
        profileComplete: student.profileComplete,
        assignedExamId: student.assignedExamId,
        assignedExam: assignedExam
          ? { id: assignedExam._id, title: assignedExam.title }
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Assessment — returns assigned exam with questions (no correct answers)
exports.getAssessment = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.profileComplete) {
      return res.status(403).json({
        success: false,
        message: "Please complete your profile before accessing the assessment",
      });
    }

    if (!student.assignedExamId) {
      await assignExamToStudent(student);
    }

    const exam = await Exam.findById(student.assignedExamId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "No assessment assigned",
      });
    }

    const questions = await QuestionBank.find({
      examId: exam._id,
      isActive: true,
    });

    const attempt = await ExamAttempt.findOne({
      studentId: student._id,
      examId: exam._id,
    });

    res.status(200).json({
      success: true,
      data: {
        exam: {
          id: exam._id,
          title: exam.title,
          description: exam.description,
          duration: exam.duration,
          totalMarks: exam.totalMarks,
          passingMarks: exam.passingMarks,
        },
        questions: stripCorrectAnswers(questions),
        attempt: attempt
          ? {
              status: attempt.status,
              startedAt: attempt.startedAt,
              expiresAt: attempt.expiresAt,
              submittedAt: attempt.submittedAt,
              score: attempt.score,
              passed: attempt.passed,
            }
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Start Assessment
exports.startAssessment = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);

    if (!student?.assignedExamId) {
      return res.status(404).json({
        success: false,
        message: "No assessment assigned",
      });
    }

    const exam = await Exam.findById(student.assignedExamId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    let attempt = await ExamAttempt.findOne({
      studentId: student._id,
      examId: exam._id,
    });

    if (attempt?.status === "submitted") {
      return res.status(400).json({
        success: false,
        message: "Assessment already submitted",
      });
    }

    if (attempt?.status === "in_progress") {
      return res.status(200).json({
        success: true,
        message: "Assessment already in progress",
        data: {
          attemptId: attempt._id,
          startedAt: attempt.startedAt,
          expiresAt: attempt.expiresAt,
          duration: exam.duration,
        },
      });
    }

    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + exam.duration * 60 * 1000);

    attempt = await ExamAttempt.findOneAndUpdate(
      { studentId: student._id, examId: exam._id },
      {
        status: "in_progress",
        startedAt,
        expiresAt,
        totalMarks: exam.totalMarks,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Assessment started. Camera monitoring is required.",
      data: {
        attemptId: attempt._id,
        startedAt: attempt.startedAt,
        expiresAt: attempt.expiresAt,
        duration: exam.duration,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Log Activity — camera, phone, speech, focus, window switch events
exports.logActivity = async (req, res) => {
  try {
    const { eventType, description, metadata } = req.body;

    const student = await Student.findById(req.student.id);

    const attempt = await ExamAttempt.findOne({
      studentId: student._id,
      examId: student.assignedExamId,
      status: "in_progress",
    });

    if (!attempt) {
      return res.status(400).json({
        success: false,
        message: "No active assessment session",
      });
    }

    const log = await ActivityLog.create({
      studentId: student._id,
      examAttemptId: attempt._id,
      eventType,
      description,
      metadata,
    });

    const violationTypes = [
      "WINDOW_SWITCH",
      "PHONE_DETECTED",
      "SPEECH_DETECTED",
      "FOCUS_LOST",
      "CAMERA_OFF",
      "TAB_CHANGE",
    ];

    if (violationTypes.includes(eventType)) {
      attempt.violationCount += 1;
      await attempt.save();
    }

    res.status(201).json({
      success: true,
      message: "Activity logged",
      data: log,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Submit Assessment
exports.submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answers array is required",
      });
    }

    const student = await Student.findById(req.student.id);

    const attempt = await ExamAttempt.findOne({
      studentId: student._id,
      examId: student.assignedExamId,
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "No assessment attempt found",
      });
    }

    if (attempt.status === "submitted") {
      return res.status(400).json({
        success: false,
        message: "Assessment already submitted",
      });
    }

    if (attempt.status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message: "Assessment has not been started",
      });
    }

    // Reject late submissions (60s grace for network delay)
    if (attempt.expiresAt && Date.now() > attempt.expiresAt.getTime() + 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "Assessment time has expired",
      });
    }

    const exam = await Exam.findById(student.assignedExamId);
    const questionIds = answers.map((a) => a.questionId);
    const questions = await QuestionBank.find({ _id: { $in: questionIds } });

    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    let totalScore = 0;
    const savedAnswers = [];

    for (const item of answers) {
      const question = questionMap.get(item.questionId);

      if (!question) continue;

      const { isCorrect, marksAwarded } = gradeAnswer(
        question,
        item.selectedAnswer
      );

      totalScore += marksAwarded;

      const answer = await Answer.findOneAndUpdate(
        {
          studentId: student._id,
          examId: exam._id,
          questionId: question._id,
        },
        {
          studentId: student._id,
          examId: exam._id,
          questionId: question._id,
          selectedAnswer: item.selectedAnswer,
          isCorrect,
          marksAwarded,
        },
        { upsert: true, new: true }
      );

      savedAnswers.push(answer);
    }

    attempt.status = "submitted";
    attempt.submittedAt = new Date();
    attempt.score = totalScore;
    attempt.passed = totalScore >= exam.passingMarks;
    await attempt.save();

    res.status(200).json({
      success: true,
      message: "Assessment submitted successfully",
      data: {
        attemptId: attempt._id,
        score: totalScore,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        passed: attempt.passed,
        violationCount: attempt.violationCount,
        answersCount: savedAnswers.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get submission result
exports.getResult = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);

    const attempt = await ExamAttempt.findOne({
      studentId: student._id,
      examId: student.assignedExamId,
      status: "submitted",
    }).populate("examId", "title totalMarks passingMarks");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "No submitted assessment found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        exam: attempt.examId,
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        passed: attempt.passed,
        submittedAt: attempt.submittedAt,
        violationCount: attempt.violationCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

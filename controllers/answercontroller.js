const Answer = require("../models/answer");

exports.submitAnswer = async (req, res) => {
  try {
    const answer = await Answer.create(req.body);
    res.status(201).json({ success: true, data: answer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllAnswers = async (req, res) => {
  try {
    const answers = await Answer.find();
    res.status(200).json({ success: true, count: answers.length, data: answers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ success: false, message: "Answer not found" });
    }
    res.status(200).json({ success: true, data: answer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ success: false, message: "Answer not found" });
    }
    await answer.deleteOne();
    res.status(200).json({ success: true, message: "Answer deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

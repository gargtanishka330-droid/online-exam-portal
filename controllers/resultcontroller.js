const result = require("../models/result");
const exam = require("../models/exam");


exports.submitResult = async (req, res) => {
  try {

    const {
      student,
      exam,
      answers,
      obtainedMarks,
      timeTaken
    } = req.body;


    const examData = await Exam.findById(exam);

    if (!examData) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }


    const percentage =
      (obtainedMarks / examData.totalMarks) * 100;


    const status =
      obtainedMarks >= examData.passingMarks
        ? "Pass"
        : "Fail";


    const result = await result.create({
      student,
      exam,
      answers,
      totalMarks: examData.totalMarks,
      obtainedMarks,
      percentage,
      status,
      timeTaken
    });


    res.status(201).json({
      message: "Result submitted",
      result
    });


  } catch(error) {

    res.status(500).json({
      message:error.message
    });

  }
};



exports.getAllResults = async(req,res)=>{
  try{

    const results = await Result.find()
      .populate("student")
      .populate("exam");


    res.json(results);

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};



exports.getResultById = async(req,res)=>{
  try{

    const result = await Result.findById(req.params.id)
      .populate("student")
      .populate("exam");


    res.json(result);

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};



exports.getStudentResults = async(req,res)=>{
  try{

    const results = await Result.find({
      student:req.params.studentId
    }).populate("exam");


    res.json(results);

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};



exports.deleteResult = async(req,res)=>{
  try{

    await Result.findByIdAndDelete(req.params.id);

    res.json({
      message:"Result deleted"
    });


  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};
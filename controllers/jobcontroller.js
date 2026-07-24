const Job = require("../models/job");

exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    const populated = await Job.findById(job._id).populate("company");
    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("company").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

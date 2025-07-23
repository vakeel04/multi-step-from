const Job = require("../models/jobModel");
const { v4: uuidv4 } = require("uuid");

const createJob = async (req, res) => {
  try {
    const {companyName,candidateName,jobTitle} = req.body
    const rawLink = uuidv4();
    const link = rawLink.replace(/-/g, ''); 
    if(req.file){
      req.body.logo = req.file.path 
    }
    const payload = {
      ...req.body,
      link, // assign generated link
    };
    console.log("job role --->  ",req.body.jobRole)
    // console.log("file--",req.file)
    // console.log("body--",req.body)
    // console.log("payload--",payload)
  
    const newJob = await Job.create(payload);
    return res.status(201).json({
      status: true,
      message: "Job created successfully",
      data: newJob,
    });
  } catch (error) {
    console.error("createJob error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};


 
const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { companyname: { $regex: search, $options: "i" } },
        { jobTitle: { $regex: search, $options: "i" } },
        { candidateName: { $regex: search, $options: "i" } }
      ]
    };

    const jobs = await Job.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      data: jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("getAllJobs error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get Job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ status: false, message: "Job not found" });

    res.status(200).json({ status: true, message: "Job found", data: job });
  } catch (error) {
    console.error("getJobById error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update Job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Job.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ status: false, message: "Job not found for update" });

    res.status(200).json({ status: true, message: "Job updated successfully", data: updated });
  } catch (error) {
    console.error("updateJob error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ status: false, message: "Job not found for deletion" });

    res.status(200).json({ status: true, message: "Job deleted successfully", data: deleted });
  } catch (error) {
    console.error("deleteJob error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};

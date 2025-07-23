const JobForm = require("../models/jobFormModel");
const Job = require("../models/jobModel");
const createJobForm = async (req, res) => {
  try {
   const {link} =req.params 
    const isLinkValid =  await Job.findOne({ link:link });
    if(!isLinkValid) return res.status(404).send({ status: false, message: "link is not valid." })
    const alreadyExists = await JobForm.findOne({ link });
    if (alreadyExists) return res.status(409).send({ status: false, message: "Job Form already exists with this link." });

  let experience =  {
    companyName : req.body.companyName,
    jobRole : req.body.jobRole,
    location :  req.body.location,
    joiningDate : req.body.joiningDate,
    endDate :  req.body.endDate,
    totalExperience: req.body.totalExperience,
  }
    // Handle file uploads from multer
    const files = req.files;
    const getFilePath = (name) => files?.[name]?.[0]?.path || '';

    const newForm = await JobForm.create({
      ...req.body,
      experiences:experience,
      panFront: getFilePath('panFront'),
      panBack: getFilePath('panBack'),
      aadharFront: getFilePath('aadharFront'),
      aadharBack: getFilePath('aadharBack'),
      marksheet10: getFilePath('marksheet10'),
      marksheet12: getFilePath('marksheet12'),
      qualificationMarksheet: getFilePath('qualificationMarksheet'),
      fresherCV: getFilePath('fresherCV'),
      resume: getFilePath('resume'),
      link:link
    });
    return res.status(201).send({ status: true, message: "Job form submitted successfully", data: newForm });
  } catch (error) {
    console.log("createJobForm error:", error);
    res.status(500).send({ status: false, message: error.message });
  }
};

const getAllJobForms = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", city = "" } = req.query;

    const query = {
      $and: [
        {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { number: { $regex: search, $options: "i" } },
          ],
        },
        city ? { "currentCity": city } : {},
      ],
    };

    const forms = await JobForm.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await JobForm.countDocuments(query);

    res.status(200).json({
      data: forms,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data", error: err.message });
  }

};

const getJobFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await JobForm.findById(id);
    if (!form) return res.status(404).send({ status: false, message: "Job form not found" });
    return res.status(200).send({ status: true, message: "Job form found", data: form });
  } catch (error) {
    console.log("getJobFormById error:", error);
    res.status(500).send({ status: false, message: error.message });
  }
};

const updateJobForm = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await JobForm.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).send({ status: false, message: "Job form not found for update" });
    return res.status(200).send({ status: true, message: "Job form updated successfully", data: updated });
  } catch (error) {
    console.log("updateJobForm error:", error);
    res.status(500).send({ status: false, message: error.message });
  }
};

const deleteJobForm = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await JobForm.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ status: false, message: "Job form not found for deletion" });
    return res.status(200).send({ status: true, message: "Job form deleted successfully", data: deleted });
  } catch (error) {
    console.log("deleteJobForm error:", error);
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  createJobForm,
  getAllJobForms,
  getJobFormById,
  updateJobForm,
  deleteJobForm
};

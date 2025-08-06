const { v4: uuidv4 } = require("uuid");
const Job = require("../models/jobModel"); // Sequelize model
const { Op } = require("sequelize");

const createJob = async (req, res) => {
  try {
    const rawLink = uuidv4().replace(/-/g, "");

    const { companyName, jobRole } = req.body;

    const companyLogo = companyName + ".png";
    const payload = {
      ...req.body,
      link: rawLink,
      logo: companyLogo,
    };
    // ✅ Store job data in cookie (signed)
    res.cookie(
      "job",
      { companyName: companyName },
      {
        httpOnly: true, // prevents JavaScript access
        secure: false, // true only in production HTTPS
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        signed: true, // signed cookie for security
      }
    );
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
    const offset = (page - 1) * limit;

    const result = await Job.findAndCountAll({
      where: {
        [Op.or]: [
          { companyName: { [Op.like]: `%${search}%` } },
          { jobRole: { [Op.like]: `%${search}%` } },
          { candidateName: { [Op.like]: `%${search}%` } },
        ],
      },
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      data: result.rows,
      total: result.count,
      page: parseInt(page),
      pages: Math.ceil(result.count / limit),
    });
  } catch (error) {
    console.error("getAllJobs error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ status: false, message: "Job not found" });
    }
    res.status(200).json({ status: true, message: "Job found", data: job });
  } catch (error) {
    console.error("getJobById error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const [updatedCount, updatedRows] = await Job.update(req.body, {
      where: { id },
      returning: true,
    });

    if (updatedCount === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Job not found for update" });
    }

    res.status(200).json({
      status: true,
      message: "Job updated successfully",
      data: updatedRows[0],
    });
  } catch (error) {
    console.error("updateJob error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Job.destroy({ where: { id } });

    if (!deleted) {
      return res
        .status(404)
        .json({ status: false, message: "Job not found for deletion" });
    }

    res.status(200).json({ status: true, message: "Job deleted successfully" });
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

// Sequelize Models
const JobForm = require("../models/jobFormModel");
const Job = require("../models/jobModel");
const { Op } = require("sequelize");

const createJobForm = async (req, res) => {
  try {
    console.log("body===========", req.body);
    const { link } = req.params;
    console.log("link", link);

    const isLinkValid = await Job.findOne({ where: { link } });
    if (!isLinkValid)
      return res
        .status(404)
        .send({ status: false, message: "Link is not valid." });

    const alreadyExists = await JobForm.findOne({ where: { link } });
    if (alreadyExists)
      return res.status(409).send({
        status: false,
        message: "Job form already exists with this link.",
      });

    // Handle file uploads
    const files = req.files;
    const getFilePath = (name) => files?.[name]?.[0]?.path || "";

    let experienceArray = [];

    const expInput = req.body.experiences?.[0];

    if (expInput) {
      // If it's a multiple-experience form (arrays)
      if (
        Array.isArray(expInput.companyName) &&
        Array.isArray(expInput.jobRole)
      ) {
        for (let i = 0; i < expInput.companyName.length; i++) {
          experienceArray.push({
            companyName: expInput.companyName[i],
            jobRole: expInput.jobRole[i],
            location: expInput.location[i],
            joiningDate: expInput.joiningDate[i],
            endDate: expInput.endDate[i],
            totalExperience: expInput.experienceDays?.[i] || "",
          });
        }
      } else {
        // Single experience object (all fields are strings)
        experienceArray.push({
          companyName: expInput.companyName,
          jobRole: expInput.jobRole,
          location: expInput.location,
          joiningDate: expInput.joiningDate,
          endDate: expInput.endDate,
          totalExperience: expInput.experienceDays || "",
        });
      }
    }
    console.log("experienceArray---->", experienceArray);

    const formData = {
      ...req.body,
      experiences: experienceArray,
      panFront: getFilePath("panFront"),
      panBack: getFilePath("panBack"),
      aadharFront: getFilePath("aadharFront"),
      aadharBack: getFilePath("aadharBack"),
      marksheet10: getFilePath("marksheet10"),
      marksheet12: getFilePath("marksheet12"),
      lastQualificationMarksheet: getFilePath("lastQualificationMarksheet"),
      fresherCV: getFilePath("fresherCV"),
      resume: getFilePath("resume"),
      link,
    };
    console.log("formdata---", formData);

    const newForm = await JobForm.create(formData);
    return res.status(201).send({
      status: true,
      message: "Job form submitted successfully",
      data: newForm,
    });
  } catch (error) {
    console.error("createJobForm error:", error);
    res.status(500).send({ status: false, message: error.message });
  }
};

const getAllJobForms = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", city = "" } = req.query;

    const whereClause = {
      [Op.and]: [
        {
          [Op.or]: [
            { fullName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { number: { [Op.like]: `%${search}%` } },
          ],
        },
        city ? { currentCity: city } : {},
      ],
    };

    const offset = (page - 1) * limit;

    const { rows, count } =
      (await JobForm.findAndCountAl) -
      l({
        where: whereClause,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      data: rows,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch data", error: err.message });
  }
};

const getJobFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await JobForm.findByPk(id);
    if (!form)
      return res
        .status(404)
        .send({ status: false, message: "Job form not found" });
    return res
      .status(200)
      .send({ status: true, message: "Job form found", data: form });
  } catch (error) {
    console.error("getJobFormById error:", error);
    res.status(500).send({ status: false, message: error.message });
  }
};

const updateJobForm = async (req, res) => {
  try {
    const { id } = req.params;

    const formData = {
      ...req.body,
      experiences: req.body.experiences
        ? JSON.parse(req.body.experiences)
        : undefined,
    };

    const [updated] = await JobForm.update(formData, {
      where: { id },
      returning: true,
    });

    if (!updated)
      return res
        .status(404)
        .send({ status: false, message: "Job form not found for update" });

    const updatedForm = await JobForm.findByPk(id);
    return res.status(200).send({
      status: true,
      message: "Job form updated successfully",
      data: updatedForm,
    });
  } catch (error) {
    console.error("updateJobForm error:", error);
    res.status(500).send({ status: false, message: error.message });
  }
};

const deleteJobForm = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await JobForm.destroy({ where: { id } });
    if (!deleted)
      return res
        .status(404)
        .send({ status: false, message: "Job form not found for deletion" });
    return res
      .status(200)
      .send({ status: true, message: "Job form deleted successfully" });
  } catch (error) {
    console.error("deleteJobForm error:", error);
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  createJobForm,
  getAllJobForms,
  getJobFormById,
  updateJobForm,
  deleteJobForm,
};

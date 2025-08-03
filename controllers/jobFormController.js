// Sequelize Models
const JobForm = require("../models/jobFormModel");
const Job = require("../models/jobModel");
const { Op } = require("sequelize");
const sendMail = require("../service/mail_sender");

const createJobForm = async (req, res) => {
  try {
    console.log("body===========", req.body);
    const { link } = req.params;

    // ✅ Step 1: Validate link
    const isLinkValid = await Job.findOne({ where: { link } });
    if (!isLinkValid) {
      return res
        .status(404)
        .json({ status: false, message: "Link is not valid." });
    }

    // ✅ Step 2: Validate candidate email
    if (!req.body.email) {
      return res.status(400).json({
        status: false,
        message: "Candidate email is missing.",
      });
    }
  

    // ✅ Step 4: Prepare files
    const files = req.files;
    const getFilePath = (name) => files?.[name]?.[0]?.path || "";

    // ✅ Step 5: Handle experiences
    let experienceArray = [];
    const expInput = req.body.experiences?.[0];

    if (expInput) {
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

    // ✅ Step 6: Create form data object
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

    // ✅ Step 7: Insert into DB
    const newForm = await JobForm.create(formData);

    /** ✅ Send email to Candidate **/
    await sendMail(
      req.body.email,
      "Job Application Submitted",
      `<h2>Hello ${req.body.fullName},</h2>
      <p>Thank you for applying for the position. We have received your application.</p>
      <p>Our HR team will contact you soon.</p>
      <br>
      <p>Best Regards,<br>HR Team</p>`
    );

    /** ✅ Send email to HR **/
    const hrEmail = req.session?.user?.email;
    if (hrEmail) {
      await sendMail(
        hrEmail,
        `New Job Application from ${req.body.fullName}`,
        `<h2>New Job Application Details:</h2>
        <p><strong>Name:</strong> ${req.body.fullName}</p>
        <p><strong>Email:</strong> ${req.body.email}</p>
        <p><strong>Phone:</strong> ${req.body.number}</p>
        <p><strong>City:</strong> ${req.body.currentCity}</p>
        <br>
        <p>Check admin panel for full details.</p>`
      );
    }

    return res.status(201).json({
      status: true,
      message: "Job form submitted successfully",
      data: newForm,
    });
  } catch (error) {
    console.error("createJobForm error:", error);
    return res.status(500).json({ status: false, message: error.message });
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

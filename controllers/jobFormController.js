// jobFormController.js

const JobForm = require("../models/jobFormModel");
const Job = require("../models/jobModel");
const { Op } = require("sequelize");
const sendMail = require("../service/mail_sender");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

const otpFilePath = path.join(__dirname, "otpData.json");
const sendOtpToEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ status: false, message: "Email is required" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Send the email
    await sendMail(
      email,
      "Email Verification OTP",
      `<p>Your OTP is: <strong>${otp}</strong><br>This OTP is valid for 5 minutes.</p>`
    );
    // Store in JSON file
    let otpData = {};
    if (fs.existsSync(otpFilePath)) {
      otpData = JSON.parse(fs.readFileSync(otpFilePath, "utf8") || "{}");
    }
    otpData[email] = {
      otp,
      createdAt: new Date().toISOString(),
    };
    fs.writeFileSync(otpFilePath, JSON.stringify(otpData, null, 2));
    return res.json({ status: true, message: "OTP sent successfully." });
  } catch (err) {
    console.error("Send OTP Error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to send OTP." });
  }
};

const verifyOtpFromJson = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ status: false, message: "Email and OTP are required" });
    }

    if (!fs.existsSync(otpFilePath)) {
      return res
        .status(400)
        .json({ status: false, message: "No OTP data found" });
    }

    const otpData = JSON.parse(fs.readFileSync(otpFilePath, "utf8") || "{}");

    const record = otpData[email];
    if (!record) {
      return res
        .status(400)
        .json({ status: false, message: "No OTP found for this email" });
    }

    const isExpired = new Date() - new Date(record.createdAt) > 5 * 60 * 1000;
    if (isExpired) {
      delete otpData[email];
      fs.writeFileSync(otpFilePath, JSON.stringify(otpData, null, 2));
      return res.status(400).json({ status: false, message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ status: false, message: "Invalid OTP" });
    }

    // Success — remove OTP after verification
    delete otpData[email];
    fs.writeFileSync(otpFilePath, JSON.stringify(otpData, null, 2));

    return res.json({ status: true, message: "OTP verified successfully." });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to verify OTP" });
  }
};

// ✅ Create Job Form
const createJobForm = async (req, res) => {
  try {
    console.log("body---", req.body);
    const { link } = req.params;
    const { email } = req.body;
    const isLinkValid = await Job.findOne({ where: { link } });
    if (!isLinkValid) {
      return res
        .status(404)
        .json({ status: false, message: "Link is not valid." });
    }

    const files = req.files;
    const getFilePath = (name) => files?.[name]?.[0]?.path || "";

    let experienceArray = [];
    const expInput = req.body.experiences?.[0];

    if (expInput) {
      if (
        Array.isArray(expInput.companyName) &&
        Array.isArray(expInput.jobProfile)
      ) {
        for (let i = 0; i < expInput.companyName.length; i++) {
          experienceArray.push({
            companyName: expInput.companyName[i],
            jobProfile: expInput.jobProfile[i],
            location: expInput.location[i],
            joiningDate: expInput.joiningDate[i],
            endDate: expInput.endDate[i],
            totalExperience: expInput.experienceDays?.[i] || "",
          });
        }
      } else {
        experienceArray.push({
          companyName: expInput.companyName,
          jobProfile: expInput.jobProfile,
          location: expInput.location,
          joiningDate: expInput.joiningDate,
          endDate: expInput.endDate,
          totalExperience: expInput.experienceDays || "",
        });
      }
    }

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
    console.log("form----", formData);
    const newForm = await JobForm.create(formData);
    // ✅ Send email to candidate
    const candidateName = req.body.fullName;
    const position = req.body.jobProfile || "N/A";
    const submissionDate = new Date().toLocaleDateString("en-IN");
    const hrName = req.signedCookies.user.name || "HR";
    const companyName = req.signedCookies.job.companyName || "Company";

    await sendMail(
      email,
      "Your Onboarding Form Has Been Successfully Submitted",
      `
      <p>Dear <strong>${candidateName}</strong>,</p>
      <p>Thank you for submitting your onboarding form. We are pleased to inform you that your details have been successfully recorded.</p>
      <p>Our HR team will review the information and reach out to you soon with the next steps.</p>
      <p><strong>Here are the details we have received:</strong></p>
      <p><strong>Full Name:</strong> ${candidateName}</p>
      <p><strong>For Position:</strong> ${position}</p>
      <p><strong>Date of Submission:</strong> ${submissionDate}</p>
      <br>
      <p>Best regards,<br>${hrName}<br>${companyName}</p>
    `
    );

    // ✅ Send email to HR
    const hrEmail = req.signedCookies.user.email;
    console.log("hrEmail--", hrEmail);
    if (hrEmail) {
      const location = req.body.currentCity || "N/A";
      const contactInfo = `${req.body.email} / ${req.body.number}`;

      await sendMail(
        hrEmail,
        `New Onboarding Form Submission – ${candidateName}`,
        `
        <p>This is to inform you that the onboarding form for <strong>${candidateName}</strong> has been successfully filled out. Please find below the details:</p>
        <p><strong>Candidate Name:</strong> ${candidateName}</p>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Date of Submission:</strong> ${submissionDate}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Contact Information:</strong> ${contactInfo}</p>
      `
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

// ✅ Get All Job Forms
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

    const { rows, count } = await JobForm.findAndCountAll({
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

// ✅ Get Job Form by ID
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

// ✅ Update Job Form
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

// ✅ Delete Job Form
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
  sendOtpToEmail,
  verifyOtpFromJson,
  getAllJobForms,
  getJobFormById,
  updateJobForm,
  deleteJobForm,
};

const express = require("express");
const router = express.Router();
const jobFormController = require("../controllers/jobFormController");
const upload = require("../service/img");
router.post("/send-otp", jobFormController.sendOtpToEmail);
router.post("/verify-otp", jobFormController.verifyOtpFromJson);
router.post(
  "jobForm/:link",
  upload.fields([
    { name: "panFront" },
    { name: "panBack" },
    { name: "aadharFront" },
    { name: "aadharBack" },
    { name: "marksheet10" },
    { name: "marksheet12" },
    { name: "lastQualificationMarksheet" },
    { name: "fresherCV" },
    { name: "resume" },
  ]),
  jobFormController.createJobForm
);

router.get("jobForm/", jobFormController.getAllJobForms);
router.get("jobForm/:id", jobFormController.getJobFormById);
router.put("jobForm/:id", jobFormController.updateJobForm);
router.delete("jobForm/:id", jobFormController.deleteJobForm);

module.exports = router;

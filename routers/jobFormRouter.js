const express = require("express");
const router = express.Router();
 
const jobFormController = require("../controllers/jobFormController");



const upload = require("../service/img")

router.post(
  "/:link",
  upload.fields([
    { name: 'panFront' },
    { name: 'panBack' },
    { name: 'aadharFront' },
    { name: 'aadharBack' },
    { name: 'marksheet10' },
    { name: 'marksheet12' },
    { name: 'lastQualificationMarksheet' },
    { name: 'fresherCV' },
    { name: 'resume' }
  ]),
  jobFormController.createJobForm
);

router.get("/", jobFormController.getAllJobForms);
router.get("/:id", jobFormController.getJobFormById);
router.put("/:id", jobFormController.updateJobForm);
router.delete("/:id", jobFormController.deleteJobForm);

module.exports = router;

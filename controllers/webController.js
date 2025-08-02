const JobForm = require("../models/jobFormModel");
const Job = require("../models/jobModel");

const multiStepFormController = async (req, res) => {
  try {
    const link = req.params.link;

    // Step 1: Check if form already submitted for this link
    const isFormSubmitted = await JobForm.findOne({ where: { link } });
    if (isFormSubmitted) {
      return res.send("Form already submitted. This link has expired.");
    }
    // Step 2: Check if job link is valid
    const job = await Job.findOne({ where: { link } });
    if (!job) return res.send({ message: "This link is not valid!" });

    // Step 3: Render form
    res.render("multistep-form", {
      status: true,
      message: "Form page loaded",
      error: {},
      data: {
        link,
        job,
      },
      title: "Job Application Form",
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error?error=" + error.message);
  }
};
const loginController = async (req, res) => {
  try {
    res.render("login", {
      status: true,
      message: "login page successfully loaded",
      error: {},
      data: {},
      title: "login Page",
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error?error=" + error.message);
  }
};
module.exports = { multiStepFormController, loginController };

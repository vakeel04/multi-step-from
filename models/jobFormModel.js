const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    email: { type: String, required: true },
    number: { type: Number, required: true },
    AlternateNumber: { type: Number, required: true },
    fatherNumber: { type: Number, required: true },
    motherNumber: { type: Number, required: true },

    currentAddress: String,
    currentCity: String,
    currentPincode: String,
    permanentAddress: String,
    permanentCity: String,
    permanentPincode: String,

    panFront: String,
    panBack: String,
    aadharFront: String,
    aadharBack: String,
    marksheet10: String,
    marksheet12: String,
    lastQualification: String,
    lastQualificationMarksheet: String,
    experienceType: String,

    // Step 3: Experience
    fresherCV: String,
    experiences: [
      {
        companyName: String,
        jobRole: String,
        location: String,
        joiningDate: Date,
        endDate: Date,
        totalExperience: String,
      },
    ],
    resume: String,

    // Step 4: Job Role
    jobProfile: String,
    salary: String,
    referredBy: String,
    interviewDate: String,
    interviewType: String,
    link: { type: String, required: true, unique: true }, 
  },
  { timestamps: true }
);

const JobForm = mongoose.model("job-forms", schema);
module.exports = JobForm;

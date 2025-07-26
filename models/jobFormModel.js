const mongoose = require("mongoose");
const mobileNumberValidator = {
  validator: function (v) {
    return /^[6-9][0-9]{9}$/.test(v);
  },
  message: props => `${props.value} is not a valid 10-digit mobile number`,
};
const schema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    email: {
      type: String, unique: true, trime: true, validate: {
          validator: function (v) {
              return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
          },
          message: "Please enter a valid email"
      }, required: true
  },
  number: {type: String,required: true,validate: mobileNumberValidator,},
  AlternateNumber: {type: String,required: true,validate: mobileNumberValidator, },
  fatherNumber: { type: String, required: true, validate: mobileNumberValidator, },
  motherNumber: {type: String, required: true, validate: mobileNumberValidator,},
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
 
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    logo: { type: String, required: true },
    jobRole: [{ type: String, required: true }],
    candidateName: { type: String, required: true },
    link: { type: String, required: true, unique: true }, 
  },
  { timestamps: true }
);

const Job = mongoose.model("job", jobSchema);
module.exports = Job;

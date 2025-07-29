const express = require("express");
const jobRouter = express.Router();
const {createJob,getAllJobs,getJobById,updateJob,deleteJob} = require("../controllers/jobController");
jobRouter.post("/", createJob);
jobRouter.get("/", getAllJobs);
jobRouter.get("/:id", getJobById);
jobRouter.put("/:id", updateJob);
jobRouter.delete("/:id", deleteJob);

module.exports = jobRouter;

const express = require("express");
const jobRouter = express.Router();
const upload = require("../service/img")
const {createJob,getAllJobs,getJobById,updateJob,deleteJob} = require("../controllers/jobController");
jobRouter.post("/", upload.none(), createJob);
jobRouter.get("/", getAllJobs);
jobRouter.get("/:id", getJobById);
jobRouter.put("/:id", updateJob);
jobRouter.delete("/:id", deleteJob);

module.exports = jobRouter;

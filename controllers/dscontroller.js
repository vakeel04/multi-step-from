const JobForm = require("../models/jobFormModel");  
const Job = require("../models/jobModel")
const dsController = async (req, res) => {
 const  job = await Job.find({}).sort({createAt:-1})
     try {
      res.render("add-job", {
        status: true,
        message: "dashboard  page successfully loaded",
        error: {},
        data: {job},
        title: "dashboard Page",
      });
    } catch (error) {
      console.log(error)
      res.redirect("/error?error=" + error.message);
    }
  };

  const candidateDetail = async (req, res) => {
    const {link} = req.params
    const detail = await JobForm.findOne({link})
  
    try {
      const { link } = req.params;
      const form = await JobForm.findOne(link);
      if (!form) {
        return res.status(404).render("errorPage", { message: "Candidate not found" });
      }
      res.render("candidate-detail", {
        status: true,
        message: "candidate-detail  page successfully loaded",
        error: {},
        data: {
          detail
        },
        title: "candidate-detail Page",
        
      });
    } catch (error) {
      console.log(error)
      res.redirect("/error?error=" + error.message);
    }
  };
  module.exports = {dsController,candidateDetail}
  
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
    try {
      const { link } = req.params;
      const form = await JobForm.findOne({ link: link });
      if (!form) return res.status(404).send("Candidate form not fill!");
      console.log("from---",form)
      res.render("candidate-detail", {
        status: true,
        message: "Candidate-detail page successfully loaded",
        error: {},
        data: {
          form },  
        title: "Candidate Detail Page",
      });
  
    } catch (error) {
      console.log(error);
      res.redirect("/error?error=" + error.message);
    }
  };
  module.exports = {dsController,candidateDetail}
  
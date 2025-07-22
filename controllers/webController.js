 const JobForm = require("../models/jobFormModel")
 const Job = require("../models/jobModel")
const multiStepFormController = async (req, res) => {
    try {
      // const  job = await Job.findOne({link:req.params.link})
      // if(!job)return res.send("this link is not valid !")
      res.render("multistep-form", {
        status: true,
        message: "Home page successfully loaded",
        error: {},
        data: {
       
        },
        title: "Home Page",
        
      });
    } catch (error) {
      console.log(error)
      res.redirect("/error?error=" + error.message);
    }
  };
  module.exports = {multiStepFormController}
  
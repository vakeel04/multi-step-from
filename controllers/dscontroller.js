const JobForm = require("../models/jobFormModel");
const Job = require("../models/jobModel");

const dsController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    // 🔍 Create filter for search
    const query = search
      ? {
          $or: [
            { candidateName: { $regex: search, $options: "i" } },
            { jobRole: { $elemMatch: { $regex: search, $options: "i" } } }
          ]
        }
      : {};

    // 📄 Get paginated job data
    const job = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalDocs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    res.render("add-job", {
      data: {
        job,
        sort: req.query.sort || "desc",
        page,
        totalPages,
        limit,
        search, // Include search value to show in input
      },
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error?error=" + error.message);
  }
};

const candidateDetail = async (req, res) => {
  try {
    const { link } = req.params;
    const form = await JobForm.findOne({ link });
    if (!form) return res.status(404).send("Candidate form not fill!");
    res.render("candidate-detail", {
      status: true,
      message: "Candidate-detail page successfully loaded",
      error: {},
      data: { form },
      title: "Candidate Detail Page",
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error?error=" + error.message);
  }
};

module.exports = { dsController, candidateDetail };

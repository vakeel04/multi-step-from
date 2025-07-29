const Job = require("../models/jobModel");
const JobForm = require("../models/jobFormModel");
const { Op } = require("sequelize");

// 🧾 Display Job Data with Pagination and Search
const dsController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    // 🔍 Filter
    const whereCondition = search
      ? {
          [Op.or]: [
            { candidateName: { [Op.like]: `%${search}%` } },
            { jobRole: { [Op.like]: `%${search}%` } },
          ]
        }
      : {};

    // 📄 Fetch data + count
    const { count: totalDocs, rows: job } = await Job.findAndCountAll({
      where: whereCondition,
      order: [['createdAt', req.query.sort === 'asc' ? 'ASC' : 'DESC']],
      offset,
      limit,
    });

    const totalPages = Math.ceil(totalDocs / limit);

    res.render("add-job", {
      data: {
        job,
        sort: req.query.sort || "desc",
        page,
        totalPages,
        limit,
        search,
      },
    });
  } catch (error) {
    console.error(error);
    res.redirect("/error?error=" + error.message);
  }
};

// 🧾 Candidate Detail
const candidateDetail = async (req, res) => {
  try {
    const { link } = req.params;

    const form = await JobForm.findOne({ where: { link } });

    if (!form) return res.status(404).send("Candidate form not filled!");

    res.render("candidate-detail", {
      status: true,
      message: "Candidate-detail page successfully loaded",
      error: {},
      data: { form },
      title: "Candidate Detail Page",
    });
  } catch (error) {
    console.error(error);
    res.redirect("/error?error=" + error.message);
  }
};

module.exports = { dsController, candidateDetail };

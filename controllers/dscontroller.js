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
          ],
        }
      : {};

    // 📄 Fetch data + count
    const { count: totalDocs, rows: job } = await Job.findAndCountAll({
      where: whereCondition,
      order: [["createdAt", req.query.sort === "asc" ? "ASC" : "DESC"]],
      offset,
      limit,
    });

    const totalPages = Math.ceil(totalDocs / limit);
    const user = req.session.user;
    if (!user) return res.redirect("/login");
    res.render("add-job", {
      data: {
        job,
        sort: req.query.sort || "desc",
        page,
        totalPages,
        limit,
        search,
        user,
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
    // 👇 Parse experiences if it's a JSON string
    if (typeof form.experiences === "string") {
      try {
        form.experiences = JSON.parse(form.experiences);
      } catch (e) {
        form.experiences = []; // fallback to empty array
      }
    }

    res.render("candidate-detail", {
      status: true,
      message: "Candidate-detail page successfully loaded",
      error: {},
      data: {
        form,
      },
      title: "Candidate Detail Page",
    });
  } catch (error) {
    console.error(error);
    res.redirect("/error?error=" + error.message);
  }
};

module.exports = { dsController, candidateDetail };

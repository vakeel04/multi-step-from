const express = require("express")
const dsRouter = express.Router()
const controller = require("../controllers/dscontroller")

dsRouter.get("/dashboard",controller.dsController)
dsRouter.get("/candidate-detail/:link",controller.candidateDetail)


module.exports = dsRouter
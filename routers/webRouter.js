const express = require("express")
const webRouter = express.Router()
const controller = require("../controllers/webController")

webRouter.get("/multistep-form/:link",controller.multiStepFormController)

module.exports = webRouter
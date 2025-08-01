const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");

userRouter.post("/", userController.createUser);
userRouter.post("/login", userController.loginUser);

module.exports = userRouter;

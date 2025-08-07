const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
var path = require("path");
const ejs = require("ejs");
var logger = require("morgan");

const env = require("dotenv");
const Sequelize = require("./config/db");
const router = require("./routers/jobFormRouter");
const webRouter = require("./routers/webRouter");
const dsRouter = require("./routers/dsRouter");
const jobRouter = require("./routers/jobRouter");
const userRouter = require("./routers/userRouter");
const cookieParser = require("cookie-parser");

//Server Terms
const app = express();
const Server = http.createServer(app);
const port = 8081;

const cleanExpiredOtps = require("./controllers/otpCleaner");

setInterval(cleanExpiredOtps, 1 * 30 * 1000);
console.log("🔁 OTP auto-cleaner started...");

// app.use(
//   cors({
//     origin: "localhost:8081",
//     credentials: true,
//   })
// );

//Env config
env.config();
app.use(cookieParser("hello"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Template engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.static("public"));

app.use("/", router);
app.use("/", webRouter);
app.use("/", dsRouter);
app.use("/user", userRouter);
app.use("/job", jobRouter);

//Dynamic Files Setup
app.use("/files", express.static(path.join(__dirname, "files")));

const uploadsPath = path.join(__dirname, "images");
app.use("/images", express.static(uploadsPath));

Server.listen(port, () => {
  console.log(`ds Url :->) http://localhost:${port}/login`);
});

// otpless
// APP ID: 2VYHYHQ0C4UF8NEPSHUN
// Client ID: V7MNHJ4SHOOSX1CQI6FA86ULEJN1ADEB
// CLient Secret: yb9kkh0pjrudt97jhmnc9ll47lvj7bap

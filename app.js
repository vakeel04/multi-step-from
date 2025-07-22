const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
var path = require("path");
const ejs = require("ejs");
var logger = require("morgan");
const cookieParser = require("cookie-parser");
const env = require("dotenv");
const database = require("./config/db")
const router  = require("./routers/jobFormRouter")
const webRouter = require("./routers/webRouter")
const dsRouter = require("./routers/dsRouter")
const jobRouter = require("./routers/jobRouter")
 

//Server Terms
const app = express();
const Server = http.createServer(app);
const port = 8081;

//Env config
env.config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
database();


// Template engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));



app.use("/jobForm",router)
app.use("/",webRouter)
app.use("/",dsRouter)
app.use("/job",jobRouter)

//Dynamic Files Setup
app.use("/files", express.static(path.join(__dirname, "files")));

const uploadsPath = path.join(__dirname, "images");
app.use("/images", express.static(uploadsPath));

Server.listen(port, () => {
  console.log(`Web Url :->) http://localhost:${port}/multistep-form`);
  console.log(`ds Url :->) http://localhost:${port}/dashboard`);

});

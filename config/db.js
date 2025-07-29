const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  "",
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: true,
  }
);

sequelize
  .authenticate()
  .then((w) => {
    sequelize.sync()
    console.log("MySQL connection established successfully.");
  })
  .catch((error) => {
    console.log("MySQL connection established failse Error: ", error);
  });

module.exports = { sequelize };

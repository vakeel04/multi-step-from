const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Job = sequelize.define(
  "Job",
  {
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobRole: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hrName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    OfferedSalary: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    candidateName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    interviewType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    logo: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    tableName: "jobs",
  }
);

module.exports = Job;

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const JobForm = sequelize.define(
  "JobForm",
  {
    fullName: { type: DataTypes.STRING, allowNull: false },
    fatherName: { type: DataTypes.STRING, allowNull: false },
    motherName: { type: DataTypes.STRING, allowNull: false },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "Please enter a valid email" },
      },
    },

    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AlternateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fatherNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    motherNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    currentAddress: DataTypes.STRING,
    currentState: DataTypes.STRING,
    currentCity: DataTypes.STRING,
    currentPincode: DataTypes.STRING,
    permanentAddress: DataTypes.STRING,
    permanentState: DataTypes.STRING,
    permanentCity: DataTypes.STRING,
    permanentPincode: DataTypes.STRING,

    panFront: DataTypes.STRING,
    panBack: DataTypes.STRING,
    aadharFront: DataTypes.STRING,
    aadharBack: DataTypes.STRING,
    marksheet10: DataTypes.STRING,
    marksheet12: DataTypes.STRING,
    lastQualification: DataTypes.STRING,
    lastQualificationMarksheet: DataTypes.STRING,
    experienceType: DataTypes.STRING,

    fresherCV: DataTypes.STRING,

    experiences: {
      type: DataTypes.JSON, // store array of objects
      allowNull: true,
    },

    resume: DataTypes.STRING,

    jobProfile: DataTypes.STRING,
    salary: DataTypes.STRING,
    referredBy: DataTypes.STRING,
    interviewDate: DataTypes.STRING,
    interviewType: DataTypes.STRING,

    link: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    tableName: "job_forms",
  }
);

module.exports = JobForm;

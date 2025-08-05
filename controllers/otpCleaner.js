// controllers/otpCleaner.js
const fs = require("fs");
const path = require("path");

const otpFilePath = path.join(__dirname, "./otpData.json");

const cleanExpiredOtps = () => {
  try {
    if (!fs.existsSync(otpFilePath)) {
      console.log("⚠️ otpData.json not found.");
      return;
    }

    let otpData = JSON.parse(fs.readFileSync(otpFilePath, "utf8") || "{}");
    const now = new Date();

    let isUpdated = false;

    Object.keys(otpData).forEach((email) => {
      const createdAt = new Date(otpData[email].createdAt);
      const ageInMs = now - createdAt;

      if (ageInMs > 5 * 60 * 1000) {
        // Delete OTP if older than 5 minutes
        delete otpData[email];
        isUpdated = true;
      }
    });

    if (isUpdated) {
      fs.writeFileSync(otpFilePath, JSON.stringify(otpData, null, 2));
    } else {
      // console.log("❌ Already cleaned jason, no expire OTP present.");
    }
  } catch (err) {
    console.error("❌ OTP Cleaner error:", err.message);
  }
};

// Export the function
module.exports = cleanExpiredOtps;

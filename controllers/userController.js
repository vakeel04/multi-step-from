const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: "User already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      status: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("createUser error:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Email and password are required." });
    }
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ status: false, message: "email is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid password." });
    }
    // ✅ Store user data in cookie (signed)
    res.cookie(
      "user",
      { id: user.id, name: user.name, email: user.email },
      {
        httpOnly: true, // prevents JavaScript access
        secure: false, // true only in production HTTPS
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        signed: true, // signed cookie for security
      }
    );
    return res.status(200).json({
      status: true,
      message: "Login successful.",
    });
  } catch (error) {
    console.error("loginUser error:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = { createUser, loginUser };

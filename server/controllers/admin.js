import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import { validatePassword } from "../utils/validatePassword.js";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const isDev = process.env.NODE_ENV !== "production";

export const adminSignup = async (req, res) => {
  try {
    const { workEmail, password, fullName, organizationName } = req.body;

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    const existingAdmin = await Admin.findOne({ workEmail });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const createdAdmin = await Admin.create({
      workEmail,
      password: hashedPassword,
      fullName,
      organizationName,
      role: "admin",
    });

    const token = jwt.sign(
      { email: createdAdmin.workEmail, id: createdAdmin._id, role: "admin" },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        sameSite: isDev ? "lax" : "none",
        secure: !isDev,
        httpOnly: true,
      })
      .status(201)
      .json({
        id: createdAdmin._id,
        workEmail: createdAdmin.workEmail,
        fullName: createdAdmin.fullName,
        organizationName: createdAdmin.organizationName,
        role: "admin",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { workEmail, password } = req.body;

    const foundAdmin = await Admin.findOne({ workEmail });
    if (!foundAdmin)
      return res.status(404).json({ message: "Admin does not exist" });

    if (!bcrypt.compareSync(password, foundAdmin.password))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: foundAdmin.workEmail, id: foundAdmin._id, role: "admin" },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        sameSite: isDev ? "lax" : "none",
        secure: !isDev,
        httpOnly: true,
      })
      .json({
        id: foundAdmin._id,
        workEmail: foundAdmin.workEmail,
        fullName: foundAdmin.fullName,
        organizationName: foundAdmin.organizationName,
        role: "admin",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const adminLogout = (req, res) => {
  res
    .cookie("token", "", {
      sameSite: isDev ? "lax" : "none",
      secure: !isDev,
      httpOnly: true,
      maxAge: 0,
    })
    .json({ message: "Logged out successfully" });
};

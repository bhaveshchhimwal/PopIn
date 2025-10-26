import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import { getAdmin } from "../utils/firebase.js";
import { validatePassword } from "../utils/validatePassword.js";
const admin = getAdmin();
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);
const isDev = process.env.NODE_ENV !== "production";

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      name: `${name}`,
      role: "user",
    });

    const token = jwt.sign(
      { email: createdUser.email, id: createdUser._id },
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
      .json({ id: createdUser._id, email: createdUser.email, name: createdUser.name });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    // console.log("Login request body:", req.body);

    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    // console.log("Found user:", foundUser);

    if (!foundUser)
      return res.status(404).json({ message: "User does not exist" });

    if (!bcrypt.compareSync(password, foundUser.password))
      return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { email: foundUser.email, id: foundUser._id },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        sameSite: isDev ? "lax" : "none",
        secure: !isDev,
        httpOnly: true,
      })
      .json({ id: foundUser._id, email: foundUser.email, name: foundUser.name });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid: googleId, email, name } = decodedToken;

    let existingUser = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!existingUser) {
      existingUser = await User.create({ name, email, googleId, role: "user" });
    } else if (!existingUser.googleId) {
      existingUser.googleId = googleId;
      await existingUser.save();
    }

    const appToken = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.cookie("token", appToken, {
      sameSite: isDev ? "lax" : "none",
      secure: !isDev,
      httpOnly: true,
    }).json({
      id: existingUser._id,
      email: existingUser.email,
      name: existingUser.name,
    });
  } catch (error) {
    console.error("Google Auth error:", error);
    res.status(500).json({ message: "Something went wrong with Google login" });
  }
};



export const logout = (req, res) => {
  res
    .cookie("token", "", {
      sameSite: isDev ? "lax" : "none",
      secure: !isDev,
      httpOnly: true,
      maxAge: 0,
    })
    .json({ message: "Logged out successfully" });
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../prismaClient.js";
import { getAdmin } from "../utils/firebase.js";
import { validatePassword } from "../utils/validatePassword.js";

dotenv.config();
const admin = getAdmin();

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

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);

    const createdUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "user",
      },
    });

    const token = jwt.sign(
      { email: createdUser.email, id: createdUser.id },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        sameSite: isDev ? "lax" : "none",
        secure: !isDev,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      })
      .status(201)
      .json({
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
      });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!foundUser)
      return res.status(404).json({ message: "User does not exist" });

    if (!foundUser.password || !bcrypt.compareSync(password, foundUser.password))
      return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { email: foundUser.email, id: foundUser.id },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        sameSite: isDev ? "lax" : "none",
        secure: !isDev,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      })
      .json({
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      });
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

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
    });

    let user = existingUser;

    if (!existingUser) {
      user = await prisma.user.create({
        data: { name, email, googleId, role: "user" },
      });
    } else if (!existingUser.googleId) {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: { googleId },
      });
    }

    const appToken = jwt.sign(
      { email: user.email, id: user.id },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", appToken, {
        sameSite: isDev ? "lax" : "none",
        secure: !isDev,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      })
      .json({
        id: user.id,
        email: user.email,
        name: user.name,
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
      path: "/",
    })
    .json({ message: "Logged out successfully" });
};

export const me = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "not authenticated" });
  return res.json({ user: req.user });
};

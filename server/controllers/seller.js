import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../prismaClient.js";
import { validatePassword } from "../utils/validatePassword.js";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const isDev = process.env.NODE_ENV !== "production";

export const sellerSignup = async (req, res) => {
  try {
    const { workEmail, password, fullName, organizationName } = req.body;

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    const existingSeller = await prisma.seller.findUnique({
      where: { workEmail },
    });

    if (existingSeller)
      return res.status(400).json({ message: "Seller already exists" });

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const createdSeller = await prisma.seller.create({
      data: {
        workEmail,
        password: hashedPassword,
        fullName,
        organizationName,
        role: "seller",
      },
    });

    const token = jwt.sign(
      { email: createdSeller.workEmail, id: createdSeller.id, role: "seller" },
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
        id: createdSeller.id,
        workEmail: createdSeller.workEmail,
        fullName: createdSeller.fullName,
        organizationName: createdSeller.organizationName,
        role: "seller",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

export const sellerLogin = async (req, res) => {
  try {
    const { workEmail, password } = req.body;

    const foundSeller = await prisma.seller.findUnique({
      where: { workEmail },
    });

    if (!foundSeller)
      return res.status(404).json({ message: "Seller does not exist" });

    if (!bcrypt.compareSync(password, foundSeller.password))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: foundSeller.workEmail, id: foundSeller.id, role: "seller" },
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
        id: foundSeller.id,
        workEmail: foundSeller.workEmail,
        fullName: foundSeller.fullName,
        organizationName: foundSeller.organizationName,
        role: "seller",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const sellerLogout = (req, res) => {
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

export const sellerMe = async (req, res) => {
  const auth = req.user || req.seller;
  if (!auth) return res.status(401).json({ error: "not authenticated" });
  return res.json({ seller: auth });
};

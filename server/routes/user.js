import express from "express";
import { googleAuth, logout, signup, login } from "../controllers/user.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/logout", logout);

export default router;

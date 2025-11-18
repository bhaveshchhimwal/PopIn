import express from "express";
import { googleAuth, logout, signup, login, me } from "../controllers/user.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/logout", logout);
router.get("/me", authenticateUser, me); 

export default router;
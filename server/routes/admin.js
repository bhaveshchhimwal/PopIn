import express from "express";
import { adminSignup, adminLogin, adminLogout } from "../controllers/admin.js";

const router = express.Router();

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.post("/logout", adminLogout);

export default router;

import express from "express";
import { sellerSignup, sellerLogin, sellerLogout, sellerMe } from "../controllers/seller.js";
import { authenticateSeller } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", sellerSignup);
router.post("/login", sellerLogin);
router.post("/logout", sellerLogout);
router.get("/me", authenticateSeller, sellerMe); 

export default router;
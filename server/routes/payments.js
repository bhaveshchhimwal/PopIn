import express from "express";
import { createCheckoutSession } from "../controllers/payments.js";
import { stripeWebhookHandler } from "../controllers/webhook.js";
import { authenticateUser } from "../middlewares/auth.js";
import { verifyCheckoutSession } from "../controllers/payments.js";

const router = express.Router();


router.post("/create-checkout-session", authenticateUser, createCheckoutSession);


router.post("/webhook", stripeWebhookHandler);
router.get("/verify-session", verifyCheckoutSession);


export default router;
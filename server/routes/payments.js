import express from "express";
import { createCheckoutSession } from "../controllers/payments.js";
import { stripeWebhookHandler } from "../controllers/webhook.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();


router.post("/create-checkout-session", authenticateUser, createCheckoutSession);


router.post("/webhook", stripeWebhookHandler);

export default router;

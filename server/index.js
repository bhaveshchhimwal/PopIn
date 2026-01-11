import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

import ticketRoutes from "./routes/ticket.js";
import userRoutes from "./routes/user.js";
import sellerRoutes from "./routes/seller.js";
import eventRoutes from "./routes/event.js";
import paymentsRoutes from "./routes/payments.js";
import { stripeWebhookHandler } from "./controllers/webhook.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/payments", paymentsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../client/dist");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendPath));
  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
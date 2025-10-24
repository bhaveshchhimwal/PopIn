import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";
import path from "fs"
// load .env first

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));


// Mount routes
app.use("/user", userRoutes);

app.listen(8080, () => {
  console.log("🚀 Server is running on http://localhost:8080");
});

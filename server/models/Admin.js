import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  organizationName: { type: String, required: true },
  workEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // no Google OAuth
  role: { type: String, default: "admin" }
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);

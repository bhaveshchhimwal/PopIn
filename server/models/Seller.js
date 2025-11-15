import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    organizationName: { type: String, required: true },
    workEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "seller" },
  },
  { timestamps: true }
);

export default mongoose.model("Seller", sellerSchema);

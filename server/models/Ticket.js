import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    eventName: { type: String, required: true },
    date: { type: Date, required: true },
    unitPrice: { type: Number, required: true, default: 0 },   
    totalPrice: { type: Number, required: true, default: 0 },  
    quantity: { type: Number, required: true, default: 1 },
      stripeSessionId: { type: String, index: true, unique: false }, 
    purchaseDate: { type: Date },
      ticketNumber: { type: String, unique: true, index: true },   
    status: {
      type: String,
      enum: ["active", "used", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);

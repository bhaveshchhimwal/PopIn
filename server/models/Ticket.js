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
        price: { type: Number, required: true },
        qrCode: { type: String },
        status: {
            type: String,
            enum: ["active", "used", "cancelled"],
            default: "active",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);

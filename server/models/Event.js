import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["music", "tech", "sports", "comedy", "education", "other", "business"],
      default: "other",
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be positive"],
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be at least 1"],
    },
    ticketsSold: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

eventSchema.pre("save", function (next) {
  const now = new Date();
  if (this.date < now && this.status === "upcoming") {
    this.status = "completed";
  }
  next();
});

export default mongoose.model("Event", eventSchema);

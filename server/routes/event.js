import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getSellerEvents,         // <-- make sure this is imported
} from "../controllers/event.js";
import { authenticateUser, authenticateSeller } from "../middlewares/auth.js";

const router = express.Router();

// Seller create event
router.post("/createevent", authenticateSeller, createEvent);
router.post("/createvent", authenticateSeller, createEvent);

// Seller-only events list
router.get("/seller/myevents", authenticateSeller, getSellerEvents);   // <-- ADD THIS

// Update / delete
router.put("/:id", authenticateSeller, updateEvent);
router.delete("/:id", authenticateSeller, deleteEvent);

// Public events
router.get("/", authenticateUser, getAllEvents);
router.get("/:id", authenticateUser, getEventById);

export default router;

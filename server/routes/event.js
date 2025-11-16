// routes/event.js
import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.js";
import { authenticateUser, authenticateSeller } from "../middlewares/auth.js";

const router = express.Router();

// Accept both spellings temporarily so frontend and backend mismatch won't 404
router.post("/createevent", authenticateSeller, createEvent);
router.post("/createvent", authenticateSeller, createEvent); // added duplicate route

router.put("/:id", authenticateSeller, updateEvent);
router.delete("/:id", authenticateSeller, deleteEvent);

router.get("/", authenticateUser, getAllEvents);
router.get("/:id", authenticateUser, getEventById);

export default router;

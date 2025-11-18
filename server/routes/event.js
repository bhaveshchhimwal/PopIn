import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getSellerEvents,    
} from "../controllers/event.js";
import { authenticateUser, authenticateSeller } from "../middlewares/auth.js";

const router = express.Router();

router.post("/createevent", authenticateSeller, createEvent);

router.get("/seller/myevents", authenticateSeller, getSellerEvents); 

router.put("/:id", authenticateSeller, updateEvent);
router.delete("/:id", authenticateSeller, deleteEvent);


router.get("/", authenticateUser, getAllEvents);
router.get("/:id", authenticateUser, getEventById);

export default router;

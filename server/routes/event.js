import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.js";
import  Auth  from "../middlewares/auth.js";

const router = express.Router();

router.post("/createvent", Auth, createEvent);
router.put("/:id", Auth, updateEvent);
router.delete("/:id", Auth, deleteEvent);


router.get("/", Auth, getAllEvents);
router.get("/:id", Auth, getEventById);


export default router;

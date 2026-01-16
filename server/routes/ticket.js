import express from "express";
import { authenticateUser, authenticateSeller } from "../middlewares/auth.js";
import {
  getTicketsDashboard,
  getUserTickets,
  getTicketsForSeller,
  getTicketById,
} from "../controllers/ticket.js";

const router = express.Router();

router.get("/", authenticateUser, getTicketsDashboard);

router.get("/mine", authenticateUser, getUserTickets);

router.get("/seller", authenticateSeller, getTicketsForSeller);

router.get("/:id", authenticateUser, getTicketById);

export default router;

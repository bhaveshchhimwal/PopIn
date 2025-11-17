// server/routes/ticket.js
import express from "express";
import { authenticateUser, authenticateSeller } from "../middlewares/auth.js";
import {
  getTicketsDashboard,
  getUserTickets,
  createTicket,
  getTicketsForSeller,
  getTicketById,
} from "../controllers/ticket.js";

const router = express.Router();

// buyer: combined dashboard (ticketsOwned, ticketsForSellerEvents, sellerEvents)
router.get("/", authenticateUser, getTicketsDashboard);

// buyer: get your tickets (legacy / alternate)
router.get("/mine", authenticateUser, getUserTickets);

// buyer: create/book ticket
router.post("/", authenticateUser, createTicket);

// seller: get tickets sold for seller's events
router.get("/seller", authenticateSeller, getTicketsForSeller);

// get ticket by id (buyer/seller)
router.get("/:id", authenticateUser, getTicketById);

export default router;

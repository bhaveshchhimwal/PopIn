import express from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { getUserTickets, createTicket } from "../controllers/ticket.js";

const router = express.Router();

router.get("/", authenticateUser, getUserTickets);
router.post("/", authenticateUser, createTicket);

export default router;

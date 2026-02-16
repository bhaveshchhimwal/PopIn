import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();
router.post("/fix-tickets-sold", async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    const results = [];

    for (const event of events) {
      const ticketCount = await prisma.ticket.count({
        where: { eventId: event.id }
      });
      
      await prisma.event.update({
        where: { id: event.id },
        data: { ticketsSold: ticketCount }
      });
      
      results.push({ 
        title: event.title, 
        oldValue: event.ticketsSold,
        newValue: ticketCount 
      });
    }
    
    return res.json({ success: true, updated: results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

export default router; 
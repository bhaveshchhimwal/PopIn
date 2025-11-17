import Ticket from "../models/Ticket.js";

export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user._id;

    const tickets = await Ticket.find({ userId })
      .populate("eventId")        // event details
      .sort({ createdAt: -1 });   // newest first

    return res.json({ tickets });
  } catch (error) {
    console.error("Get tickets error:", error);
    return res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { eventId, eventName, date, price, qrCode } = req.body;

    const ticket = await Ticket.create({
      userId: req.user._id,
      eventId,
      eventName,
      date,
      price,
      qrCode
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

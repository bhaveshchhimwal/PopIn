import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import mongoose from "mongoose";
import { generateTicketNumber } from "../utils/generateTicketNumber.js";


export const getTicketsDashboard = async (req, res) => {
  try {
    const user = req.user ?? req.seller;
    if (!user || !user._id) return res.status(401).json({ message: "Not authenticated" });

    const userId = user._id;

    const ticketsOwned = await Ticket.find({ userId })
      .populate("eventId")
      .sort({ createdAt: -1 });

    const sellerEvents = await Event.find({ createdBy: userId }).select("_id title date image");
    const sellerEventIds = sellerEvents.map((e) => e._id);

    const ticketsForSellerEvents = sellerEventIds.length
      ? await Ticket.find({ eventId: { $in: sellerEventIds } })
          .populate("userId", "name email")
          .populate("eventId", "title date")
          .sort({ createdAt: -1 })
      : [];

    return res.json({ ticketsOwned, ticketsForSellerEvents, sellerEvents });
  } catch (error) {
    console.error("getTicketsDashboard error:", error);
    return res.status(500).json({ message: "Failed to fetch tickets" });
  }
};


export const getUserTickets = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.user._id;

    const tickets = await Ticket.find({ userId })
      .populate("eventId")
      .sort({ createdAt: -1 });

    return res.json({ tickets });
  } catch (error) {
    console.error("Get tickets error:", error);
    return res.status(500).json({ message: "Failed to fetch tickets" });
  }
};


export const createTicket = async (req, res) => {
  let session = null;
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.user._id;
    const { eventId, quantity = 1 } = req.body;

    if (!eventId) return res.status(400).json({ message: "eventId is required" });

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) return res.status(400).json({ message: "Invalid quantity" });

    try {
      session = await mongoose.startSession();
      session.startTransaction();
    } catch {
      session = null;
    }

    const event = await Event.findById(eventId).session(session ?? undefined);
    if (!event) {
      if (session) await session.abortTransaction();
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.capacity !== undefined && event.capacity !== null) {
      if (event.capacity < qty) {
        if (session) await session.abortTransaction();
        return res.status(400).json({ message: "Not enough tickets available" });
      }
      event.capacity -= qty;
      await event.save({ session });
    }

    const unitPrice = Number(event.price ?? 0);
    const totalPrice = unitPrice * qty;

    const ticketDoc = {
      userId: new mongoose.Types.ObjectId(userId),
      eventId: new mongoose.Types.ObjectId(eventId),
      eventName: event.title ?? event.name ?? "Event",
      date: event.date ?? new Date(),
      unitPrice,
      totalPrice,
      quantity: qty,
      status: "active",
      ticketNumber: generateTicketNumber(),
    };

    const createdArr = await Ticket.create([ticketDoc], { session });
    const createdTicket = Array.isArray(createdArr) ? createdArr[0] : createdArr;

    if (session) await session.commitTransaction();

    await createdTicket.populate("eventId");

    return res.status(201).json({ ticket: createdTicket });
  } catch (error) {
    console.error("Create ticket error:", error);
    try { if (session) await session.abortTransaction(); } catch {}
    return res.status(500).json({ message: error?.message ?? "Failed to create ticket" });
  } finally {
    try { if (session) session.endSession(); } catch {}
  }
};

export const getTicketsForSeller = async (req, res) => {
  try {
    const seller = req.seller ?? req.user;
    if (!seller || !seller._id) return res.status(401).json({ message: "Not authenticated as seller" });

    const sellerId = seller._id;
    const sellerEvents = await Event.find({ createdBy: sellerId }).select("_id title date image");

    const eventIds = sellerEvents.map((e) => e._id);

    const tickets = await Ticket.find({ eventId: { $in: eventIds } })
      .populate("userId", "name email")
      .populate("eventId", "title date")
      .sort({ createdAt: -1 });

    return res.json({ sellerEvents, tickets });
  } catch (error) {
    console.error("getTicketsForSeller error:", error);
    return res.status(500).json({ message: "Failed to fetch seller tickets" });
  }
};


export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("eventId")
      .populate("userId", "name email");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    return res.json({ ticket });
  } catch (error) {
    console.error("getTicketById error:", error);
    return res.status(500).json({ message: "Failed to fetch ticket" });
  }
};

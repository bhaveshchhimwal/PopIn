import prisma from "../prismaClient.js";
import { generateTicketNumber } from "../utils/generateTicketNumber.js";

export const getTicketsDashboard = async (req, res) => {
  try {
    const auth = req.user ?? req.seller;
    if (!auth?.id) return res.status(401).json({ message: "Not authenticated" });

    const userId = auth.id;

    const ticketsOwned = await prisma.ticket.findMany({
      where: { userId },
      include: {
        event: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const sellerEvents = await prisma.event.findMany({
      where: { createdById: userId },
      select: { id: true, title: true, date: true, image: true },
    });

    const sellerEventIds = sellerEvents.map((e) => e.id);

    const ticketsForSellerEvents = sellerEventIds.length
      ? await prisma.ticket.findMany({
          where: { eventId: { in: sellerEventIds } },
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            event: {
              select: { id: true, title: true, date: true },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

    return res.json({ ticketsOwned, ticketsForSellerEvents, sellerEvents });
  } catch (error) {
    console.error("getTicketsDashboard error:", error);
    return res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const getUserTickets = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const tickets = await prisma.ticket.findMany({
      where: { userId: req.user.id },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ tickets });
  } catch (error) {
    console.error("Get tickets error:", error);
    return res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const createTicket = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.user.id;
    const { eventId, quantity = 1 } = req.body;

    if (!eventId) return res.status(400).json({ message: "eventId is required" });

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) throw new Error("Event not found");

      if (event.ticketsSold + qty > event.capacity) {
        throw new Error("Not enough tickets available");
      }

      await tx.event.update({
        where: { id: eventId },
        data: { ticketsSold: { increment: qty } },
      });

      const unitPrice = Number(event.price ?? 0);
      const totalPrice = unitPrice * qty;

      const ticket = await tx.ticket.create({
        data: {
          userId,
          eventId,
          eventName: event.title,
          eventDate: event.date,
          unitPrice,
          quantity: qty,
          totalPrice,
          status: "PENDING",
          ticketNumber: generateTicketNumber(),
        },
      });

      return ticket;
    });

    const populatedTicket = await prisma.ticket.findUnique({
      where: { id: result.id },
      include: { event: true },
    });

    return res.status(201).json({ ticket: populatedTicket });
  } catch (error) {
    console.error("Create ticket error:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const getTicketsForSeller = async (req, res) => {
  try {
    const seller = req.seller ?? req.user;
    if (!seller?.id) {
      return res.status(401).json({ message: "Not authenticated as seller" });
    }

    const sellerEvents = await prisma.event.findMany({
      where: { createdById: seller.id },
      select: { id: true, title: true, date: true, image: true },
    });

    const eventIds = sellerEvents.map((e) => e.id);

    const tickets = await prisma.ticket.findMany({
      where: { eventId: { in: eventIds } },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        event: {
          select: { id: true, title: true, date: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ sellerEvents, tickets });
  } catch (error) {
    console.error("getTicketsForSeller error:", error);
    return res.status(500).json({ message: "Failed to fetch seller tickets" });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: {
        event: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    return res.json({ ticket });
  } catch (error) {
    console.error("getTicketById error:", error);
    return res.status(500).json({ message: "Failed to fetch ticket" });
  }
};
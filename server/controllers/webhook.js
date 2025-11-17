import Stripe from "stripe";
import dotenv from "dotenv";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import mongoose from "mongoose";
import { generateTicketNumber } from "../utils/generateTicketNumber.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log("Stripe webhook hit:", new Date().toISOString());
  console.log("signature present:", !!sig);
  if (!req.body) console.warn("Warning: req.body is falsy; expected Buffer from express.raw");

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const eventId = metadata.eventId;
      const quantity = parseInt(metadata.quantity || "1", 10);
      const userId = metadata.userId;

      console.log("Processing checkout.session.completed:", {
        sessionId: session.id,
        eventId,
        quantity,
        userId,
      });

      if (!eventId || !userId) {
        console.error("Missing eventId or userId in metadata");
        return res.status(200).json({ received: true });
      }

      if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(userId)) {
        console.error("Invalid ObjectId in metadata", { eventId, userId });
        return res.status(200).json({ received: true });
      }

      const existingTicket = await Ticket.findOne({ stripeSessionId: session.id });
      if (existingTicket) {
        console.log("Ticket already exists for session:", session.id);
        return res.status(200).json({ received: true });
      }

      const ev = await Event.findById(eventId);
      if (!ev) {
        console.warn("Event not found:", eventId);
        return res.status(200).json({ received: true });
      }

      const mongoSession = await mongoose.startSession();

      try {
        await mongoSession.startTransaction();

        if (ev.capacity !== undefined && ev.capacity !== null) {
          if (ev.capacity < quantity) {
            console.warn("Not enough capacity for event:", eventId);
            await mongoSession.abortTransaction();
            return res.status(200).json({ received: true });
          }
          ev.capacity -= quantity;
          await ev.save({ session: mongoSession });
        }

        const unitPrice = Number(ev.price ?? 0);
        const totalPrice = unitPrice * quantity;

        const ticketDoc = {
          userId: new mongoose.Types.ObjectId(userId),
          eventId: new mongoose.Types.ObjectId(eventId),
          eventName: ev.title ?? ev.name ?? "Event",
          date: ev.date ?? new Date(),
          unitPrice,
          totalPrice,
          quantity,
          status: "active",
          stripeSessionId: session.id,
          purchaseDate: new Date(),
          ticketNumber: generateTicketNumber(),
        };

        const createdArr = await Ticket.create([ticketDoc], { session: mongoSession });
        const createdTicket = createdArr[0];

        await mongoSession.commitTransaction();
        console.log("Ticket created:", createdTicket._id.toString());
      } catch (err) {
        console.error("Ticket creation error:", err);
        try { await mongoSession.abortTransaction(); } catch (e) {}
        return res.status(500).json({ error: "ticket_creation_failed", message: err.message });
      } finally {
        mongoSession.endSession();
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return res.status(500).json({ error: "webhook_processing_error", message: err.message });
  }
};

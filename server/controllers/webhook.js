import Stripe from "stripe";
import dotenv from "dotenv";
import prisma from "../prismaClient.js";
import { generateTicketNumber } from "../utils/generateTicketNumber.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    const body = req.body.toString('utf8');
    
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Webhook event type:", event.type);

  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ received: true }); 
  }

  const session = event.data.object;
  const { eventId, userId, quantity } = session.metadata;
  const qty = parseInt(quantity, 10);

  try {
    await prisma.$transaction(async (tx) => {
      const ev = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!ev || ev.capacity < qty) {
        throw new Error("NOT_ENOUGH_TICKETS");
      }

      await tx.event.update({
        where: { id: eventId },
        data: {
          capacity: { decrement: qty },
        },
      });

      await tx.ticket.create({
        data: {
          userId,
          eventId,
          eventName: ev.title,
          eventDate: ev.date,
          unitPrice: ev.price,
          quantity: qty,
          totalPrice: ev.price * qty,
          stripeSessionId: session.id,
          ticketNumber: generateTicketNumber(),
          status: "CONFIRMED",
          purchaseDate: new Date(),
        },
      });
    });

    return res.status(200).json({ received: true });

  } catch (err) {
    console.error("Webhook failed:", err.message);

    if (session.payment_intent) {
      try {
        await stripe.refunds.create({
          payment_intent: session.payment_intent,
        });
      } catch (refundErr) {
        console.error("Refund failed:", refundErr.message);
      }
    }

    return res.status(200).json({ received: true });
  }
};
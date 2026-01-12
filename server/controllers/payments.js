import Stripe from "stripe";
import dotenv from "dotenv";
import prisma from "../prismaClient.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const createCheckoutSession = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }
   if (req.user.role === "seller") {
      return res.status(403).json({
        message: "Seller accounts cannot be used to purchase tickets.",
      });
    }
    const { eventId, quantity = 1 } = req.body;
    const qty = parseInt(quantity, 10);

    if (!eventId || isNaN(qty) || qty < 1) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const unitAmount = Math.round(Number(event.price) * 100);

    const successUrl =
      `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&payment_session=true`;
    const cancelUrl =
      `${process.env.CLIENT_URL}/payment/failed?payment_session=true`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: event.title },
            unit_amount: unitAmount,
          },
          quantity: qty,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        eventId,
        quantity: qty.toString(),
        userId: req.user.id,
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("createCheckoutSession error:", err);
    return res.status(500).json({ message: "Failed to create checkout session" });
  }
};

export const verifyCheckoutSession = async (req, res) => {
  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ success: false });
  }

  const ticket = await prisma.ticket.findFirst({
    where: { stripeSessionId: sessionId },
  });

  if (!ticket) {
    return res.json({
      success: false,
      reason: "NO_TICKETS_AVAILABLE",
    });
  }

  return res.json({ success: true });
};
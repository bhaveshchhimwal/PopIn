import Stripe from "stripe";
import dotenv from "dotenv";
import Event from "../models/Event.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

export const createCheckoutSession = async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ message: "Not authenticated" });

    const { eventId, quantity = 1 } = req.body;
    if (!eventId) return res.status(400).json({ message: "eventId is required" });

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) return res.status(400).json({ message: "Invalid quantity" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const priceNum = Number(event.price ?? 0);
    if (Number.isNaN(priceNum) || priceNum < 0) return res.status(400).json({ message: "Invalid event price" });

    const unitAmount = Math.round(priceNum * 100);
    const successUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/profile`;
    const cancelUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/events/${eventId}`;

  
    const productData = { name: event.title || "Event ticket" };
    const desc = (event.description ?? "").toString().trim();
    if (desc.length > 0) productData.description = desc.slice(0, 500);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: productData,
            unit_amount: unitAmount,
          },
          quantity: qty,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        eventId: eventId.toString(),
        quantity: qty.toString(),
        userId: req.user._id.toString(),
      },
    });

    return res.json({ url: session.url, id: session.id });
  } catch (err) {
  
    console.error("createCheckoutSession error:", err && err.raw ? err.raw : err);

    const message = err && err.raw && err.raw.message ? err.raw.message : (err?.message ?? "Failed to create checkout session");
    return res.status(500).json({ message });
  }
};

// scripts/backfill-event-datetimes.js
// One-off: combine existing Event.date (midnight) and Event.time into a proper Date with time.
// Usage: node scripts/backfill-event-datetimes.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import Event from "./models/Event.js"; // adjust path if your layout differs

dotenv.config();

function parseDateAndTime(dateInput, timeInput) {
  if (!dateInput) return null;
  const base = new Date(dateInput);
  if (Number.isNaN(base.getTime())) return null;

  if (timeInput && typeof timeInput === "string" && timeInput.trim() !== "") {
    const parts = timeInput.trim().split(":").map((p) => parseInt(p, 10));
    const hours = Number.isNaN(parts[0]) ? 0 : parts[0];
    const minutes = Number.isNaN(parts[1]) ? 0 : parts[1];
    const seconds = Number.isNaN(parts[2]) ? 0 : (parts[2] ?? 0);
    base.setHours(hours, minutes, seconds, 0);
  }
  return base;
}

async function run() {
  const MONGO = process.env.MONGO_URL;
  if (!MONGO) {
    console.error("Please set MONGO_URL in your environment (.env).");
    process.exit(1);
  }

  await mongoose.connect(MONGO, {});

  try {
    // Find events where `time` exists and `date` appears to be at midnight local (heuristic)
    const candidates = await Event.find({
      time: { $exists: true, $ne: "" },
      date: { $exists: true },
    }).lean();

    let updated = 0;
    for (const ev of candidates) {
      const currentDate = new Date(ev.date);
      // heuristic: date has hours === 0 and minutes === 0 (i.e., likely only a date was stored)
      const needsUpdate = currentDate.getHours() === 0 && currentDate.getMinutes() === 0;
      if (!needsUpdate) continue;

      const combined = parseDateAndTime(ev.date, ev.time);
      if (!combined) {
        console.warn("Skipping (invalid parse):", ev._id.toString(), ev.date, ev.time);
        continue;
      }

      await Event.updateOne({ _id: ev._id }, { $set: { date: combined } });
      console.log("Updated:", ev._id.toString(), "->", combined.toISOString());
      updated++;
    }

    console.log("Backfill complete. Total updated:", updated);
  } catch (err) {
    console.error("Backfill error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();

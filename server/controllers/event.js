import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import multer from "multer";
import Event from "../models/Event.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Helper: combine date + time into a single JS Date.
 * - dateInput: something like "2026-09-19" or ISO string
 * - timeInput: "05:30" or "05:30:00" (optional)
 * Returns Date object or null if invalid.
 */
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

export const createEvent = [
  upload.single("image"), 
  async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Validate & combine date + time
      const parsedDate = parseDateAndTime(req.body.date, req.body.time);
      if (!parsedDate) {
        return res.status(400).json({ message: "Invalid date or time" });
      }

      const eventData = {
        ...req.body,
        createdBy: req.user._id,
        // ensure event.date is a Date object with time applied
        date: parsedDate,
        // keep time string for display if provided
        time: req.body.time ?? "",
      };

      if (req.file && req.file.buffer) {
        try {
          const result = await uploadBufferToCloudinary(req.file.buffer, {
            folder: "popin/events",
            resource_type: "image",
            transformation: [{ width: 1200, crop: "limit" }],
          });
          eventData.image = result.secure_url;
          eventData.imagePublicId = result.public_id;
        } catch (uploadErr) {
          console.error("Cloudinary upload error:", uploadErr);
          return res.status(500).json({ message: "Failed to upload image" });
        }
      }

      const event = new Event(eventData);
      await event.save();
      res.status(201).json(event);
    } catch (error) {
      console.error("createEvent error:", error);
      res.status(400).json({ message: error.message });
    }
  },
];

export const getAllEvents = async (req, res) => {
  try {
    const { category, location, search } = req.query;
    const filter = {};

    if (category && category !== "all") filter.category = category;
    if (location) filter.location = new RegExp(location, "i");
    if (search) filter.title = { $regex: search, $options: "i" };

    const events = await Event.find(filter)
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error("getAllEvents error:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    console.error("getEventById error:", error);
    res.status(500).json({ message: "Error fetching event" });
  }
};

export const updateEvent = [
  upload.single("image"),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });

      if (event.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (req.file && req.file.buffer) {
        const result = await uploadBufferToCloudinary(req.file.buffer, {
          folder: "popin/events",
          resource_type: "image",
        });

        if (event.imagePublicId) {
          await cloudinary.uploader.destroy(event.imagePublicId);
        }

        event.image = result.secure_url;
        event.imagePublicId = result.public_id;
      }

      // Fields to copy (date/time handled separately below)
      const fields = [
        "title",
        "description",
        "category",
        // "date", // handled below
        // "time", // handled below
        "location",
        "price",
        "capacity",
        "status",
      ];

      fields.forEach((f) => {
        if (req.body[f] !== undefined) event[f] = req.body[f];
      });

      // If either date or time provided, parse & combine and set event.date
      if (req.body.date !== undefined || req.body.time !== undefined) {
        const newDateInput = req.body.date !== undefined ? req.body.date : event.date;
        const newTimeInput = req.body.time !== undefined ? req.body.time : event.time;
        const parsed = parseDateAndTime(newDateInput, newTimeInput);
        if (!parsed) {
          return res.status(400).json({ message: "Invalid date or time" });
        }
        event.date = parsed;
        // keep the time string for display
        event.time = req.body.time !== undefined ? req.body.time : event.time;
      }

      await event.save();
      res.status(200).json(event);
    } catch (error) {
      console.error("updateEvent error:", error);
      res.status(400).json({ message: error.message });
    }
  },
];

export const getSellerEvents = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const sellerId = req.user._id;
    const events = await Event.find({ createdBy: sellerId }).sort({ date: 1 });

    res.status(200).json({ events });
  } catch (err) {
    console.error("getSellerEvents error:", err);
    res.status(500).json({ message: "Failed to fetch seller events" });
  }
};
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (event.imagePublicId) {
      await cloudinary.uploader.destroy(event.imagePublicId);
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("deleteEvent error:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
};

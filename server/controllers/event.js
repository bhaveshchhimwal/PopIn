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

      const parsedDate = parseDateAndTime(req.body.date, req.body.time);
      if (!parsedDate) {
        return res.status(400).json({ message: "Invalid date or time" });
      }

      const eventData = {
        ...req.body,
        createdBy: req.user._id,
       
        date: parsedDate,
      
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
    const { category, location, q, search } = req.query;
    const filter = {};
    const categoryMap = {
      "music and theater": "music",
      music: "music",

      tech: "tech",
      technology: "tech",

      sports: "sports",
      comedy: "comedy",
      education: "education",

      business: "business",

      others: "other",
      other: "other",

      all: null,
    };

    if (category) {
      const key = String(category).trim().toLowerCase();
      const mapped = categoryMap[key];
      if (mapped) {
        filter.category = mapped;
      }
    }

    if (location) {
      filter.location = new RegExp(location, "i");
    }

    const searchTerm = q || search;
    if (searchTerm && String(searchTerm).trim() !== "") {
      const regex = new RegExp(String(searchTerm).trim(), "i");
      filter.$or = [{ title: regex }, { description: regex }];
    }

  
    filter.status = "upcoming";

   
    const rawEvents = await Event.find(filter)
      .populate("createdBy", "name email")
      .sort({ date: 1 });

   
    function combineDateAndTime(ev) {
      if (!ev || !ev.date) return null;
      const base = new Date(ev.date);

      if (ev.time && typeof ev.time === "string" && ev.time.trim() !== "") {
        const parts = ev.time.trim().split(":").map((p) => parseInt(p, 10));
        const hours = Number.isNaN(parts[0]) ? 0 : parts[0];
        const minutes = Number.isNaN(parts[1]) ? 0 : parts[1];
        const seconds = Number.isNaN(parts[2]) ? 0 : (parts[2] ?? 0);
        base.setHours(hours, minutes, seconds, 0);
      } else {
      
        base.setHours(23, 59, 59, 999);
      }
      return base;
    }

    const now = new Date();

  
    const events = rawEvents.filter((ev) => {
      const combined = combineDateAndTime(ev);
      if (!combined) return false; 
      return combined.getTime() >= now.getTime();
    });

   
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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

    
      const fields = [
        "title",
        "description",
        "category",
    
        "location",
        "price",
        "capacity",
        "status",
      ];

      fields.forEach((f) => {
        if (req.body[f] !== undefined) event[f] = req.body[f];
      });

     
      if (req.body.date !== undefined || req.body.time !== undefined) {
        const newDateInput = req.body.date !== undefined ? req.body.date : event.date;
        const newTimeInput = req.body.time !== undefined ? req.body.time : event.time;
        const parsed = parseDateAndTime(newDateInput, newTimeInput);
        if (!parsed) {
          return res.status(400).json({ message: "Invalid date or time" });
        }
        event.date = parsed;
       
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
  
    const events = await Event.find({ createdBy: sellerId }).sort({ date: -1 });

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

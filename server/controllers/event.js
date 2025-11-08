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


export const createEvent = [
  upload.single("image"), 
  async (req, res) => {
    try {
     
      if (!req.user) {
        req.user = { _id: "672a6dd799bc6d001f1a2e67" };
      }

      const eventData = {
        ...req.body,
        createdBy: req.user._id,
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

      if (!req.user) {
        req.user = { _id: event.createdBy.toString() };
      }

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
        "date",
        "time",
        "location",
        "price",
        "capacity",
        "status",
      ];

      fields.forEach((f) => {
        if (req.body[f] !== undefined) event[f] = req.body[f];
      });

      await event.save();
      res.status(200).json(event);
    } catch (error) {
      console.error("updateEvent error:", error);
      res.status(400).json({ message: error.message });
    }
  },
];

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

   
    if (!req.user) req.user = { _id: event.createdBy.toString() };

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

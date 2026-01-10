import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import multer from "multer";
import prisma from "../prismaClient.js";

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
    base.setHours(parts[0] || 0, parts[1] || 0, parts[2] || 0, 0);
  }

  return base;
}

export const createEvent = [
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const parsedDate = parseDateAndTime(req.body.date, req.body.time);
      if (!parsedDate) {
        return res.status(400).json({ message: "Invalid date or time" });
      }

      let image = "";
      let imagePublicId = null;

      if (req.file?.buffer) {
        const result = await uploadBufferToCloudinary(req.file.buffer, {
          folder: "popin/events",
          resource_type: "image",
          transformation: [{ width: 1200, crop: "limit" }],
        });
        image = result.secure_url;
        imagePublicId = result.public_id;
      }

      const status =
        parsedDate.getTime() < Date.now() ? "completed" : "upcoming";

      const event = await prisma.event.create({
        data: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          date: parsedDate,
          time: req.body.time ?? "",
          location: req.body.location,
          price: Number(req.body.price),
          capacity: Number(req.body.capacity),
          image,
          imagePublicId,
          status,
          createdById: req.user.id,
        },
      });

      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];

export const getAllEvents = async (req, res) => {
  try {
    const { category, location, q, search } = req.query;

    const where = { status: "upcoming" };

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
    };

    if (category) {
      const mapped = categoryMap[String(category).toLowerCase()];
      if (mapped) where.category = mapped;
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    const searchTerm = q || search;
    if (searchTerm?.trim()) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            organizationName: true,
            workEmail: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    const now = Date.now();

    const filtered = events.filter((ev) => {
      const base = new Date(ev.date);
      if (ev.time?.trim()) {
        const parts = ev.time.split(":").map((p) => parseInt(p, 10));
        base.setHours(parts[0] || 0, parts[1] || 0, parts[2] || 0, 0);
      } else {
        base.setHours(23, 59, 59, 999);
      }
      return base.getTime() >= now;
    });

    res.status(200).json(filtered);
  } catch {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            organizationName: true,
            workEmail: true,
          },
        },
      },
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json(event);
  } catch {
    res.status(500).json({ message: "Error fetching event" });
  }
};

export const updateEvent = [
  upload.single("image"),
  async (req, res) => {
    try {
      const event = await prisma.event.findUnique({
        where: { id: req.params.id },
      });

      if (!event) return res.status(404).json({ message: "Event not found" });
      if (event.createdById !== req.user.id)
        return res.status(403).json({ message: "Not authorized" });

      let image = event.image;
      let imagePublicId = event.imagePublicId;

      if (req.file?.buffer) {
        const result = await uploadBufferToCloudinary(req.file.buffer, {
          folder: "popin/events",
          resource_type: "image",
        });

        if (imagePublicId) {
          await cloudinary.uploader.destroy(imagePublicId);
        }

        image = result.secure_url;
        imagePublicId = result.public_id;
      }

      let parsedDate = event.date;
      if (req.body.date !== undefined || req.body.time !== undefined) {
        parsedDate = parseDateAndTime(
          req.body.date ?? event.date,
          req.body.time ?? event.time
        );
        if (!parsedDate) {
          return res.status(400).json({ message: "Invalid date or time" });
        }
      }

      const updated = await prisma.event.update({
        where: { id: event.id },
        data: {
          title: req.body.title ?? event.title,
          description: req.body.description ?? event.description,
          category: req.body.category ?? event.category,
          location: req.body.location ?? event.location,
          price:
            req.body.price !== undefined ? Number(req.body.price) : event.price,
          capacity:
            req.body.capacity !== undefined
              ? Number(req.body.capacity)
              : event.capacity,
          status: req.body.status ?? event.status,
          date: parsedDate,
          time: req.body.time ?? event.time,
          image,
          imagePublicId,
        },
      });

      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];

export const getSellerEvents = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const events = await prisma.event.findMany({
      where: { createdById: req.user.id },
      orderBy: { date: "desc" },
    });

    res.status(200).json({ events });
  } catch {
    res.status(500).json({ message: "Failed to fetch seller events" });
  }
};

// controllers/event.js
export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const ticketsCount = await prisma.ticket.count({
      where: { eventId },
    });

    if (ticketsCount > 0) {
      return res.status(400).json({
        message: "Cannot delete event. Tickets already sold.",
      });
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("deleteEvent error:", err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};

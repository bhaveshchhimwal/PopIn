import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance.js";

export function EventCreateCard({ apiEndpoint = "/events/createevent", onSuccess }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other",
    date: "",
    time: "",
    location: "",
    price: "",
    capacity: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const mapCategoryForApi = (uiCategory) => {
    if (!uiCategory) return "other";
    const key = String(uiCategory).trim().toLowerCase();
    if (Object.prototype.hasOwnProperty.call(categoryMap, key)) {
      return categoryMap[key];
    }
    return uiCategory;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const err = {};

    if (!form.title.trim()) err.title = "Title is required";

    if (!form.date) {
      err.date = "Date is required";
    } else {
      const dateTimeString = form.time
        ? `${form.date}T${form.time}:00+05:30`
        : `${form.date}T00:00:00+05:30`;

      const eventDateTime = new Date(dateTimeString);
      const now = new Date();

      if (eventDateTime < now) {
        err.date = "Event date and time cannot be in the past";
      }
    }

    if (!form.location.trim()) err.location = "Location is required";

    if (form.price === "" || Number(form.price) < 100) {
      err.price = "Price must be at least ₹100";
    }

    if (form.capacity === "" || Number(form.capacity) < 1) {
      err.capacity = "Capacity must be at least 1";
    }

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      const fd = new FormData();
      const mappedCategory = mapCategoryForApi(form.category);

      Object.keys(form).forEach((key) => {
        if (key === "category") fd.append("category", mappedCategory);
        else fd.append(key, form[key]);
      });

      if (image) fd.append("image", image);

      const res = await axios.post(apiEndpoint, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Event created successfully!");

      if (onSuccess) onSuccess(res.data);

      setTimeout(() => {
        navigate("/events");
      }, 800);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create event";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "music",
    "tech",
    "sports",
    "comedy",
    "education",
    "business",
    "other",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 max-w-xl bg-white p-6 rounded-xl shadow-md"
    >
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Event title"
        className={`w-full border px-4 py-3 text-base placeholder-slate-400 ${
          errors.title
            ? "border-red-400"
            : "border-slate-300 focus:border-slate-700"
        }`}
      />
      {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Event description"
        rows="3"
        className="w-full border border-slate-300 px-4 py-3 text-base placeholder-slate-400"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full border border-slate-300 px-4 py-3 text-base"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c[0].toUpperCase() + c.slice(1)}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={`w-full border px-4 py-3 text-base ${
              errors.date
                ? "border-red-400"
                : "border-slate-300 focus:border-slate-700"
            }`}
          />
          {errors.date && (
            <p className="text-red-600 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full border border-slate-300 px-4 py-3 text-base"
        />
      </div>

      <input
        type="text"
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Event location"
        className={`w-full border px-4 py-3 text-base placeholder-slate-400 ${
          errors.location
            ? "border-red-400"
            : "border-slate-300 focus:border-slate-700"
        }`}
      />
      {errors.location && (
        <p className="text-red-600 text-sm">{errors.location}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Ticket price (₹)"
            min="0"
            className={`w-full border px-4 py-3 text-base placeholder-slate-400 ${
              errors.price
                ? "border-red-400"
                : "border-slate-300 focus:border-slate-700"
            }`}
          />
          {errors.price && (
            <p className="text-red-600 text-sm">{errors.price}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            min="1"
            className={`w-full border px-4 py-3 text-base placeholder-slate-400 ${
              errors.capacity
                ? "border-red-400"
                : "border-slate-300 focus:border-slate-700"
            }`}
          />
          {errors.capacity && (
            <p className="text-red-600 text-sm">{errors.capacity}</p>
          )}
        </div>
      </div>

      <div>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border border-slate-300 px-3 py-2 text-base"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-3 w-full h-auto rounded-md object-cover border"
            style={{ maxHeight: 300 }}
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-base py-3 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create Event"}
      </button>

      {message && (
        <p
          className={`text-center text-sm ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
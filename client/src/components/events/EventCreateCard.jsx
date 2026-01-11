import React, { useState } from "react";
import axios from "../../utils/axiosInstance.js";
import { EventCreateCardUI } from "./EventCreateCardUI.jsx";

export function EventCreateCard({ apiEndpoint = "/events/createevent", onSuccess }) {
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

      const [year, month, day] = form.date.split("-").map(Number);

      let eventDateTime;
      if (form.time) {
        const [hh, mm] = form.time.split(":").map(Number);
        eventDateTime = new Date(year, month - 1, day, hh, mm, 0, 0);
      } else {
        eventDateTime = new Date(year, month - 1, day, 0, 0, 0, 0);
      }

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

      setMessage(" Event created successfully!");
      setForm({
        title: "",
        description: "",
        category: "other",
        date: "",
        time: "",
        location: "",
        price: "",
        capacity: "",
      });
      setImage(null);
      setPreview("");
      setErrors({});
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        " Failed to create event";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onSubmit={handleSubmit}>
      <EventCreateCardUI
        form={form}
        errors={errors}
        handleChange={handleChange}
        handleImageChange={handleImageChange}
        preview={preview}
        loading={loading}
        message={message}
      />
    </div>
  );
}

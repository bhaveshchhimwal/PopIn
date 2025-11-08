// components/events/EventCreateCard.jsx
import React, { useState } from "react";
import axios from "../../utils/axiosInstance.js";
import { EventCreateCardUI } from "./EventCreateCardUI.jsx";

export function EventCreateCard({ apiEndpoint = "/createvent", onSuccess }) {
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
    if (!form.date) err.date = "Date is required";
    if (!form.location.trim()) err.location = "Location is required";
    if (form.price === "" || Number(form.price) < 0)
      err.price = "Price must be 0 or greater";
    if (form.capacity === "" || Number(form.capacity) < 1)
      err.capacity = "Capacity must be at least 1";
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
      Object.keys(form).forEach((key) => fd.append(key, form[key]));
      if (image) fd.append("image", image);

      // ✅ axios POST call
      const res = await axios.post(apiEndpoint, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Event created successfully!");
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
        "❌ Failed to create event";
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

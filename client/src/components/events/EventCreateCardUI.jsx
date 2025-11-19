import React from "react";

export function EventCreateCardUI({
  form,
  errors,
  handleChange,
  handleImageChange,
  preview,
  loading,
  message,
}) {
  const categories = ["music", "tech", "sports", "comedy", "education","business", "other"];

  return (
    <form className="space-y-5 max-w-xl bg-white p-6 rounded-xl shadow-md">
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Event title"
        className={`w-full border px-4 py-3 text-base placeholder-slate-400 ${
          errors.title ? "border-red-400" : "border-slate-300 focus:border-slate-700"
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
              errors.date ? "border-red-400" : "border-slate-300 focus:border-slate-700"
            }`}
          />
          {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
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
          errors.location ? "border-red-400" : "border-slate-300 focus:border-slate-700"
        }`}
      />
      {errors.location && <p className="text-red-600 text-sm">{errors.location}</p>}

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
              errors.price ? "border-red-400" : "border-slate-300 focus:border-slate-700"
            }`}
          />
          {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
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
              errors.capacity ? "border-red-400" : "border-slate-300 focus:border-slate-700"
            }`}
          />
          {errors.capacity && <p className="text-red-600 text-sm">{errors.capacity}</p>}
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
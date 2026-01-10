import React from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const { title, date, location, image, price, id } = event;

  const formattedDate = date
    ? new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div
      className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/events/${id}`)}
    >
      <img
        src={image || "/assets/sample-event.jpg"}
        alt={title || "Event"}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {title || "Untitled Event"}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {location || "TBD"} • {formattedDate}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800">
            {price != null ? `₹${price}` : "Free"}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/events/${id}`);
            }}
            className="ml-4 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600"
          >
            Book Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

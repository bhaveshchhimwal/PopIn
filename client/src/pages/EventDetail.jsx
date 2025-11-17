// src/pages/EventDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance.js";
import Navbar from "../components/events/Navbar.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/events/${id}`, { withCredentials: true });
        if (res && res.data) {
          setEvent(res.data.event ?? res.data);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error loading event:", err);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadEvent();
  }, [id]);

  const formattedDateTime = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return String(d);
    }
  };

  const handleBook = async () => {
    if (!event) return;
    if (quantity < 1) {
      showToast?.("Choose at least 1 ticket", "error");
      return;
    }

    setBooking(true);
    setError("");

    try {
      const res = await axios.post(
        "/payments/create-checkout-session",
        {
          eventId: event._id ?? event.id,
          quantity,
        },
        { withCredentials: true }
      );

      const { url } = res.data;
      if (!url) throw new Error("No checkout url returned");

      window.location.href = url;
    } catch (err) {
      console.error("Booking error:", err);
      const serverMsg =
        err?.response?.data?.message ?? err?.response?.data?.error ?? null;
      const msg = serverMsg || err?.message || "Booking failed";

      setError(msg);
      showToast?.(msg, "error");
      console.log("Full error response:", err?.response);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Event not found</p>
          <button
            onClick={() => navigate("/events")}
            className="mt-2 bg-slate-800 text-white px-4 py-2 rounded"
          >
            Back to events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6 md:flex md:gap-6">
          <div className="w-full md:w-1/2">
            <img
              src={event.image || "/src/assets/hero-bg.jpg"}
              alt={event.title}
              className="w-full h-56 md:h-64 object-cover rounded"
            />
          </div>

          <div className="w-full mt-4 md:mt-0 md:w-1/2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">
              {event.title}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{event.location}</p>
            <p className="text-sm text-slate-600 mt-1">
              {formattedDateTime(event.date)}
            </p>

            <p className="mt-4 text-slate-700 text-sm md:text-base">
              {event.description}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-3">
              <div>
                <div className="text-xs text-slate-500">Price</div>
                <div className="text-lg font-semibold">
                  {event.price != null ? `₹${event.price}` : "Free"}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Seats left</div>
                <div className="text-sm text-slate-700">{event.capacity ?? "—"}</div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700">
                Quantity
              </label>
              <div className="mt-2 inline-flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-slate-200 rounded"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 1;
                    setQuantity(Math.max(1, val));
                  }}
                  min={1}
                  className="w-16 text-center border rounded px-2 py-1"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 bg-slate-200 rounded"
                >
                  +
                </button>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3">
                <button
                  onClick={handleBook}
                  disabled={booking}
                  className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
                >
                  {booking ? "Booking..." : "Book Tickets"}
                </button>

                <button
                  onClick={() => navigate("/events")}
                  className="w-full sm:w-auto bg-transparent border px-4 py-2 rounded"
                >
                  Back
                </button>
              </div>

              {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

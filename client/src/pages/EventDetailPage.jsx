import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/events/Navbar.jsx";
import useEventDetail from "../components/events/EventDetail.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const toastShownRef = useRef(false);

  const {
    event,
    loading,
    booking,
    quantity,
    error,
    setQuantity,
    formattedDateTime,
    handleBook,
  } = useEventDetail(id);

  useEffect(() => {
    if (
      event &&
      (event.capacity === 0 || event.capacity === "0") &&
      !toastShownRef.current
    ) {
      showToast?.("No seats left", "error");
      toastShownRef.current = true;
    }
  }, [event, showToast]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Event not found</p>
          <button
            onClick={() => navigate("/events", { replace: true })}
            className="mt-2 bg-slate-800 text-white px-4 py-2 rounded"
          >
            Back to events
          </button>
        </div>
      </div>
    );
  }

  if (event.capacity === 0 || event.capacity === "0") {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-semibold text-red-600">No seats left</p>
            <p className="mt-2 text-sm text-slate-700">
              This event is sold out.
            </p>
            <button
              onClick={() => navigate("/events", { replace: true })}
              className="mt-4 bg-slate-800 text-white px-4 py-2 rounded"
            >
              Back to events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const seatsLeftNumber =
    typeof event.capacity === "number"
      ? event.capacity
      : Number(event.capacity) || 0;

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
                  {event.price ? `₹${event.price}` : "Free"}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Seats left</div>
                <div className="text-sm text-slate-700">
                  {event.capacity ?? "—"}
                </div>
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
                  min={1}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
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
                  onClick={() => {
                    if (seatsLeftNumber === 0) {
                      showToast?.("No seats left", "error");
                      return;
                    }

                    if (quantity > seatsLeftNumber) {
                      showToast?.(
                        `Only ${seatsLeftNumber} seat${
                          seatsLeftNumber > 1 ? "s" : ""
                        } left`,
                        "error"
                      );
                      return;
                    }

                    handleBook();
                  }}
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

              {error && (
                <div className="mt-3 text-sm text-red-600">{error}</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

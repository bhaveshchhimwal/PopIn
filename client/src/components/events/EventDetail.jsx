import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function useEventDetail(id) {
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
        setEvent(res.data.event ?? res.data);
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

      window.location.href = res.data.url;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Booking failed";

      setError(msg);
      showToast?.(msg, "error");
    } finally {
      setBooking(false);
    }
  };

  return {
    event,
    loading,
    booking,
    quantity,
    error,
    setQuantity,
    formattedDateTime,
    handleBook,
  };
}

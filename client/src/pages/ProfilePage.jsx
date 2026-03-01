import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance.js";
import ProfileView from "../components/profile/ProfileView.jsx";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [ticketsOwned, setTicketsOwned] = useState([]);
  const [ticketsForSellerEvents, setTicketsForSellerEvents] = useState([]);
  const [error, setError] = useState("");

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios
        .get("/user/me", { withCredentials: true })
        .catch(() =>
          axios.get("/seller/me", { withCredentials: true }).catch(() => null)
        );

      if (!res || !res.data) {
        navigate("/", { replace: true });
        return;
      }

      const auth = res.data.user ?? res.data.seller ?? res.data;
      setUser(auth);

      if (auth.role === "seller") {
        const ev = await axios
          .get("/events/seller/myevents", { withCredentials: true })
          .catch(() => null);
        setCreatedEvents(ev?.data?.events ?? []);
      } else {
        setCreatedEvents([]);
      }

      const tRes = await axios
        .get("/tickets", { withCredentials: true })
        .catch(() => null);

      if (tRes) {
        setTicketsOwned(tRes.data.ticketsOwned ?? []);
        setTicketsForSellerEvents(tRes.data.ticketsForSellerEvents ?? []);
      } else {
        setTicketsOwned([]);
        setTicketsForSellerEvents([]);
      }
    } catch (err) {
      console.error("Profile fetch error", err);
      setError("Unable to load profile");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const isSeller = user.role === "seller";

  const ticketsMap = {};
  ticketsForSellerEvents.forEach((t) => {
    const id = t.eventId?.id ?? t.eventId;
    if (!ticketsMap[id]) ticketsMap[id] = [];
    ticketsMap[id].push(t);
  });

  return (
    <ProfileView
      user={user}
      isSeller={isSeller}
      createdEvents={createdEvents}
      ticketsOwned={ticketsOwned}
      ticketsForSellerEvents={ticketsForSellerEvents}
      ticketsMap={ticketsMap}
      error={error}
    />
  );
}
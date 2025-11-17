import React, { useEffect, useState } from "react";
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
  const [sellerEvents, setSellerEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const res = await axios
          .get("/user/me", { withCredentials: true })
          .catch(() => axios.get("/seller/me").catch(() => null));

        if (!res || !res.data) {
          navigate("/", { replace: true });
          return;
        }
        const auth = res.data.user ?? res.data.seller ?? res.data;
        setUser(auth);

        if (auth.role === "seller") {
          const ev = await axios.get("/events/seller/myevents").catch(() => null);
          if (ev) setCreatedEvents(ev.data.events ?? []);
        }

        const tRes = await axios.get("/tickets").catch(() => null);
        if (tRes) {
          setTicketsOwned(tRes.data.ticketsOwned ?? []);
          setTicketsForSellerEvents(tRes.data.ticketsForSellerEvents ?? []);
          setSellerEvents(tRes.data.sellerEvents ?? []);
        }
      } catch {
        setError("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return null;

  const isSeller = user.role === "seller";

  const ticketsMap = {};
  ticketsForSellerEvents.forEach((t) => {
    const ev = t.eventId;
    const id = ev?._id ?? ev ?? t.eventId;
    if (!ticketsMap[id]) ticketsMap[id] = [];
    ticketsMap[id].push(t);
  });

  return (
    <ProfileView
      user={user}
      navigate={navigate}
      isSeller={isSeller}
      createdEvents={createdEvents}
      ticketsOwned={ticketsOwned}
      ticketsForSellerEvents={ticketsForSellerEvents}
      ticketsMap={ticketsMap}
      error={error}
    />
  );
}

import React from "react";
import Navbar from "../events/Navbar.jsx";
import axios from "../../utils/axiosInstance.js";

import ProfileHeader from "./ProfileHeader";
import SellerEvents from "./SellerEvents";
import BuyerTickets from "./BuyerTickets";
import SellerTickets from "./SellerTickets";

import { formatIST, eventIsActive } from "./utils";

export default function ProfileView({
  user,
  isSeller,
  createdEvents,
  ticketsOwned,
  ticketsForSellerEvents,
  ticketsMap,
  error,
}) {
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const handleDelete = async (eventId) => {
    if (!eventId) return;

    const ok = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );
    if (!ok) return;

    try {
      await axios.delete(`/events/${eventId}`, { withCredentials: true });
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert(err.response?.data?.message || "Failed to delete event");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <ProfileHeader user={user} />

        {isSeller && createdEvents?.length > 0 && (
          <SellerEvents
            createdEvents={createdEvents}
            ticketsMap={ticketsMap}
            handleDelete={handleDelete}
            copy={copy}
          />
        )}

        {!isSeller && (
          <BuyerTickets ticketsOwned={ticketsOwned} copy={copy} />
        )}

        {isSeller && ticketsForSellerEvents?.length > 0 && (
          <SellerTickets ticketsForSellerEvents={ticketsForSellerEvents} />
        )}

        {error && <div className="mt-4 text-red-600">{error}</div>}
      </main>
    </div>
  );
}
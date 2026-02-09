import React from "react";
import Navbar from "../events/Navbar.jsx";
import axios from "../../utils/axiosInstance.js";
import profileIcon from "../../assets/profile.png";

function ShortId({ value }) {
  if (!value) return null;
  const s = value.toString();
  return <span className="font-mono">{s.slice(0, 8)}</span>;
}

const formatIST = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export default function ProfileView({
  user,
  isSeller,
  createdEvents,
  ticketsOwned,
  ticketsForSellerEvents,
  ticketsMap,
  navigate,
  error,
}) {
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const eventIsActive = (ev) => {
    if (!ev) return false;
    if (ev.status && ev.status !== "upcoming") return false;
    if (ev.date) {
      const evDate = new Date(ev.date);
      const now = new Date();
      return evDate.getTime() >= now.getTime();
    }
    return false;
  };

  const handleDelete = async (eventId) => {
    if (!eventId) return;
    const ok = window.confirm("Are you sure you want to delete this event? This action cannot be undone.");
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
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center gap-4">
          <img
            src={profileIcon}
            alt="profile"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-base sm:text-lg font-semibold break-words">
              {user.fullName ?? user.name ?? user.email}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Role: <span className="font-medium">{user.role ?? "user"}</span>
            </p>
          </div>
        </div>

        {isSeller && createdEvents?.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3">Events you created</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {createdEvents.map((ev) => {
                const id = ev.id;
                const soldTickets = ticketsMap[id] ?? [];

                return (
                  <div
                    key={id}
                    className="bg-white rounded-lg shadow overflow-hidden relative"
                  >
                    <div className="p-3">
                      <div className="sm:hidden mb-2 flex justify-end">
                        <button
                          onClick={() => handleDelete(id)}
                          className="text-xs text-red-600 border border-red-300 px-2 py-1 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-24 flex-shrink-0">
                          <img
                            src={ev.image || "/src/assets/hero-bg.jpg"}
                            alt={ev.title}
                            className="w-full h-16 sm:h-20 object-cover rounded"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="text-sm sm:text-lg font-semibold break-words">
                                {ev.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-slate-600">
                                {formatIST(ev.date)}
                              </p>
                            </div>

                            <div className="hidden sm:block ml-3">
                              <button
                                onClick={() => handleDelete(id)}
                                className="text-xs text-red-600 border border-red-300 px-2 py-1 rounded hover:bg-red-50"
                                title="Delete"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="mt-2 text-sm text-slate-700">
                            <strong>Tickets sold:</strong> {soldTickets.length}
                          </div>
                        </div>
                      </div>

                      {soldTickets.length > 0 && (
                        <div className="mt-3 border-t pt-2">
                          <h5 className="text-sm font-medium mb-2">Buyers</h5>
                          <div className="space-y-2">
                            {soldTickets.map((t) => {
                              const buyer = t.user ?? {};
                              const ticketNumber = t.ticketNumber ?? t.id;

                              return (
                                <div key={t.id} className="flex items-center justify-between text-sm">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm break-words">
                                      {buyer.name ?? buyer.email ?? "Buyer"}
                                    </div>
                                    <div className="text-slate-600 text-xs">
                                      Qty: {t.quantity ?? 1} · ₹{t.totalPrice ?? t.price ?? t.unitPrice ?? "—"}
                                    </div>

                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 break-words">
                                      <span>
                                        <strong>Ticket No:</strong>{" "}
                                        {ticketNumber ? (
                                          <span className="font-mono break-all">{ticketNumber}</span>
                                        ) : (
                                          <ShortId value={t.id} />
                                        )}
                                      </span>

                                      {ticketNumber && (
                                        <button
                                          onClick={() => copy(ticketNumber)}
                                          className="text-xs px-2 py-1 border rounded"
                                        >
                                          Copy
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div className="text-xs text-slate-500">
                                    {formatIST(t.createdAt)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {!isSeller && (
          <section className="mb-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3">Tickets you purchased</h3>

            {ticketsOwned?.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-4 text-slate-600">No tickets found.</div>
            ) : (
              <div className="space-y-3">
                {ticketsOwned.map((ticket) => {
                  const event = ticket.event ?? { title: ticket.eventName, id: ticket.eventId };
                  const ticketNumber = ticket.ticketNumber ?? ticket.id;
                  const active = eventIsActive(event);

                  return (
                    <div
                      key={ticket.id}
                      className="bg-white rounded-lg shadow p-3 flex flex-col sm:flex-row gap-3 items-start"
                    >
                      <div className="w-full sm:w-40 flex-shrink-0">
                        <img
                          src={event?.image || "/src/assets/hero-bg.jpg"}
                          alt={event?.title}
                          className="w-full h-28 object-cover rounded"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm sm:text-lg font-semibold break-words">{event?.title}</h4>

                          {active ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                              Active
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                              Inactive
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600">
                          {formatIST(ticket.createdAt)}
                        </p>

                        <div className="mt-2 text-sm text-slate-700">
                          <div>
                            <strong>Quantity:</strong> {ticket.quantity ?? 1}
                          </div>
                          <div>
                            <strong>Price:</strong> ₹
                            {ticket.totalPrice ?? ticket.price ?? ticket.unitPrice ?? "—"}
                          </div>

                          <div className="mt-2 text-sm">
                            <strong>Ticket No:</strong>{" "}
                            <span className="font-mono break-all">{ticketNumber}</span>

                            {ticketNumber && (
                              <button
                                onClick={() => copy(ticketNumber)}
                                className="ml-2 mt-1 sm:ml-2 text-xs px-2 py-1 border rounded"
                              >
                                Copy
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {isSeller && ticketsForSellerEvents?.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3">All tickets for your events</h3>

            <div className="space-y-2">
              {ticketsForSellerEvents.map((t) => {
                const event = t.event ?? {};
                const buyer = t.user ?? {};
                const ticketNumber = t.ticketNumber ?? t.id;
                const active = eventIsActive(event);

                return (
                  <div
                    key={t.id}
                    className="bg-white rounded-lg shadow p-3 flex flex-col sm:flex-row justify-between gap-3"
                  >
                    <div>
                      <div className="font-medium text-sm break-words">{event.title ?? "Event"}</div>

                      {active ? (
                        <div className="text-xs mt-1 bg-emerald-50 inline-block px-2 py-1 rounded-full text-emerald-700 border border-emerald-100">Active</div>
                      ) : (
                        <div className="text-xs mt-1 text-red-600">Inactive</div>
                      )}
                      <div className="text-xs text-slate-600">Buyer: {buyer.name ?? buyer.email ?? "—"} · Qty: {t.quantity}</div>
                      <div className="text-xs mt-1">
                        <strong>Ticket No:</strong>{" "}
                        <span className="font-mono break-all">{ticketNumber}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      {formatIST(t.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {error && <div className="mt-4 text-red-600">{error}</div>}
      </main>
    </div>
  );
}

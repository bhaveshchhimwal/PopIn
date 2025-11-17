import React from "react";
import Navbar from "../events/Navbar.jsx";

function ShortId({ value }) {
  if (!value) return null;
  const s = value.toString();
  return <span className="font-mono">{s.slice(0, 8)}</span>;
}

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

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center gap-4">
          <img
            src="/src/assets/profile.png"
            alt="profile"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-base sm:text-lg font-semibold">
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
                const id = ev._id?.toString?.() ?? ev.id?.toString?.();
                const soldTickets = ticketsMap[id] ?? [];

                return (
                  <div key={id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-24 flex-shrink-0">
                          <img
                            src={ev.image || "/src/assets/hero-bg.jpg"}
                            alt={ev.title}
                            className="w-full h-16 sm:h-20 object-cover rounded"
                          />
                        </div>

                        <div className="flex-1">
                          <h4 className="text-sm sm:text-lg font-semibold">{ev.title}</h4>
                          <p className="text-xs sm:text-sm text-slate-600">
                            {new Date(ev.date).toLocaleString()}
                          </p>
                          <p className="mt-1 text-xs sm:text-sm text-slate-700">
                            {ev.description?.slice?.(0, 120)}
                          </p>

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
                              const buyer = t.userId ?? {};
                              const ticketNumber = t.ticketNumber ?? t._id;
                              return (
                                <div key={t._id} className="flex items-center justify-between text-sm">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">
                                      {buyer.name ?? buyer.email ?? "Buyer"}
                                    </div>
                                    <div className="text-slate-600 text-xs">
                                      Qty: {t.quantity ?? 1} · ₹{t.totalPrice ?? t.price ?? t.unitPrice ?? "—"}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                      <span>
                                        <strong>Ticket No:</strong>{' '}
                                        {ticketNumber ? <span className="font-mono">{ticketNumber}</span> : <ShortId value={t._id} />}
                                      </span>
                                      {ticketNumber && (
                                        <button onClick={() => copy(ticketNumber)} className="text-xs px-2 py-1 border rounded">
                                          Copy
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {new Date(t.createdAt).toLocaleString()}
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

        <section className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3">Tickets you purchased</h3>

          {ticketsOwned?.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-4 text-slate-600">No tickets found.</div>
          ) : (
            <div className="space-y-3">
              {ticketsOwned.map((ticket) => {
                const event = ticket.eventId ?? { title: ticket.eventName, _id: ticket.eventId };
                const ticketNumber = ticket.ticketNumber ?? ticket._id;

                return (
                  <div key={ticket._id} className="bg-white rounded-lg shadow p-3 flex flex-col sm:flex-row gap-3 items-start">
                    <div className="w-full sm:w-40 flex-shrink-0">
                      <img
                        src={event?.image || "/src/assets/hero-bg.jpg"}
                        alt={event?.title}
                        className="w-full h-28 object-cover rounded"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm sm:text-lg font-semibold">{event?.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600">{new Date(ticket.createdAt).toLocaleString()}</p>

                      <div className="mt-2 text-sm text-slate-700">
                        <div><strong>Quantity:</strong> {ticket.quantity ?? 1}</div>
                        <div><strong>Price:</strong> ₹{ticket.totalPrice ?? ticket.price ?? ticket.unitPrice ?? "—"}</div>
                        <div><strong>Status:</strong> {ticket.status}</div>
                        <div className="mt-2 text-sm">
                          <strong>Ticket No:</strong>{' '}
                          <span className="font-mono break-all">{ticketNumber}</span>
                          {ticketNumber && (
                            <button onClick={() => copy(ticketNumber)} className="ml-2 text-xs px-2 py-1 border rounded">
                              Copy
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <button onClick={() => navigate(`/events/${event._id}`)} className="text-sm bg-slate-800 text-white px-3 py-2 rounded w-full sm:w-auto">
                      View event
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {isSeller && ticketsForSellerEvents?.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3">All tickets for your events</h3>

            <div className="space-y-2">
              {ticketsForSellerEvents.map((t) => {
                const event = t.eventId ?? {};
                const buyer = t.userId ?? {};
                const ticketNumber = t.ticketNumber ?? t._id;

                return (
                  <div key={t._id} className="bg-white rounded-lg shadow p-3 flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <div className="font-medium text-sm">{event.title ?? "Event"}</div>
                      <div className="text-xs text-slate-600">Buyer: {buyer.name ?? buyer.email ?? "—"} · Qty: {t.quantity}</div>
                      <div className="text-xs mt-1">
                        <strong>Ticket No:</strong> <span className="font-mono break-all">{ticketNumber}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">{new Date(t.createdAt).toLocaleString()}</div>
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

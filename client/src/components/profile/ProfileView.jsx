import React from "react";
import Navbar from "../events/Navbar.jsx";

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
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">

        <div className="bg-white rounded-lg shadow p-6 mb-6 flex items-center gap-4">
          <img
            src="/src/assets/profile.png"
            alt="profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">
              {user.fullName ?? user.name ?? user.email}
            </h2>
            <p className="text-sm text-slate-600">
              Role: <span className="font-medium">{user.role ?? "user"}</span>
            </p>
          </div>
        </div>


        {isSeller && createdEvents?.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Events you created</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {createdEvents.map((ev) => {
                const id = ev._id?.toString?.() ?? ev.id?.toString?.();
                const soldTickets = ticketsMap[id] ?? [];

                return (
                  <div key={id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-28 flex-shrink-0">
                          <img
                            src={ev.image || "/src/assets/hero-bg.jpg"}
                            alt={ev.title}
                            className="w-full h-20 object-cover rounded"
                          />
                        </div>

                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">{ev.title}</h4>
                          <p className="text-sm text-slate-600">
                            {new Date(ev.date).toLocaleString()}
                          </p>
                          <p className="mt-2 text-sm text-slate-700">
                            {ev.description?.slice?.(0, 120)}
                          </p>

                          <div className="mt-3 text-sm text-slate-700">
                            <strong>Tickets sold:</strong> {soldTickets.length}
                          </div>
                        </div>
                      </div>

                      {soldTickets.length > 0 && (
                        <div className="mt-4 border-t pt-3">
                          <h5 className="text-sm font-medium mb-2">Buyers</h5>
                          <div className="space-y-2">
                            {soldTickets.map((t) => {
                              const buyer = t.userId ?? {};
                              return (
                                <div key={t._id} className="flex items-center justify-between text-sm">
                                  <div>
                                    <div className="font-medium">
                                      {buyer.name ?? buyer.email ?? "Buyer"}
                                    </div>
                                    <div className="text-slate-600 text-xs">
                                      Qty: {t.quantity ?? 1} · ₹{t.price ?? "—"}
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

        {/* Tickets purchased */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Tickets you purchased</h3>

          {ticketsOwned?.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-slate-600">No tickets found.</div>
          ) : (
            <div className="space-y-4">
              {ticketsOwned.map((ticket) => {
                const event =
                  ticket.eventId ?? { title: ticket.eventName, _id: ticket.eventId };

                return (
                  <div
                    key={ticket._id}
                    className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row gap-4"
                  >
                    <div className="w-full sm:w-48">
                      <img
                        src={event?.image || "/src/assets/hero-bg.jpg"}
                        alt={event?.title}
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-semibold">{event?.title}</h4>
                      <p className="text-sm text-slate-600">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </p>

                      <div className="mt-2 text-sm text-slate-700">
                        <div><strong>Quantity:</strong> {ticket.quantity}</div>
                        <div><strong>Price:</strong> ₹{ticket.price}</div>
                        <div><strong>Status:</strong> {ticket.status}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="text-sm bg-slate-800 text-white px-3 py-2 rounded"
                    >
                      View event
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {isSeller && ticketsForSellerEvents?.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">All tickets for your events</h3>

            <div className="space-y-2">
              {ticketsForSellerEvents.map((t) => {
                const event = t.eventId ?? {};
                const buyer = t.userId ?? {};

                return (
                  <div key={t._id} className="bg-white rounded-lg shadow p-3 flex justify-between">
                    <div>
                      <div className="font-medium">{event.title ?? "Event"}</div>
                      <div className="text-xs text-slate-600">
                        Buyer: {buyer.name ?? buyer.email ?? "—"} · Qty: {t.quantity}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {error && <div className="mt-6 text-red-600">{error}</div>}
      </main>
    </div>
  );
}

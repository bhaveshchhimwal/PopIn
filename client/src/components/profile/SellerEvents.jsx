import React from "react";
import { formatIST } from "./utils";

function ShortId({ value }) {
  if (!value) return null;
  const s = value.toString();
  return <span className="font-mono">{s.slice(0, 8)}</span>;
}

export default function SellerEvents({
  createdEvents,
  ticketsMap,
  handleDelete,
  copy,
}) {
  return (
    <section className="mb-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-3">
        Events you created
      </h3>

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
                          <div
                            key={t.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-sm break-words">
                                {buyer.name ?? buyer.email ?? "Buyer"}
                              </div>
                              <div className="text-slate-600 text-xs">
                                Qty: {t.quantity ?? 1} · ₹
                                {t.totalPrice ??
                                  t.price ??
                                  t.unitPrice ??
                                  "—"}
                              </div>

                              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 break-words">
                                <strong>Ticket No:</strong>{" "}
                                {ticketNumber ? (
                                  <span className="font-mono break-all">
                                    {ticketNumber}
                                  </span>
                                ) : (
                                  <ShortId value={t.id} />
                                )}

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
  );
}
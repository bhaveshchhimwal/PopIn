import React from "react";
import { formatIST, eventIsActive } from "./utils";

export default function SellerTickets({ ticketsForSellerEvents }) {
  if (!ticketsForSellerEvents?.length) return null;

  return (
    <section className="mb-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-3">
        All tickets for your events
      </h3>

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
                <div className="font-medium text-sm break-words">
                  {event.title ?? "Event"}
                </div>

                {active ? (
                  <div className="text-xs mt-1 bg-emerald-50 inline-block px-2 py-1 rounded-full text-emerald-700 border border-emerald-100">
                    Active
                  </div>
                ) : (
                  <div className="text-xs mt-1 text-red-600">Inactive</div>
                )}

                <div className="text-xs text-slate-600">
                  Buyer: {buyer.name ?? buyer.email ?? "—"} · Qty: {t.quantity}
                </div>

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
  );
}
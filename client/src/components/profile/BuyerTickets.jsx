import React from "react";
import { formatIST, eventIsActive } from "./utils";

export default function BuyerTickets({ ticketsOwned, copy }) {
  return (
    <section className="mb-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-3">
        Tickets you purchased
      </h3>

      {ticketsOwned?.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-4 text-slate-600">
          No tickets found.
        </div>
      ) : (
        <div className="space-y-3">
          {ticketsOwned.map((ticket) => {
            const event =
              ticket.event ?? {
                title: ticket.eventName,
                id: ticket.eventId,
              };
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
                    <h4 className="text-sm sm:text-lg font-semibold break-words">
                      {event?.title}
                    </h4>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-red-50 text-red-600 border border-red-100"
                      }`}
                    >
                      {active ? "Active" : "Inactive"}
                    </span>
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
                      {ticket.totalPrice ??
                        ticket.price ??
                        ticket.unitPrice ??
                        "—"}
                    </div>

                    <div className="mt-2 text-sm">
                      <strong>Ticket No:</strong>{" "}
                      <span className="font-mono break-all">
                        {ticketNumber}
                      </span>

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
  );
}
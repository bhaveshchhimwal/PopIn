import React from "react";
import Navbar from "../components/events/Navbar.jsx"; 
import { EventCreateCard } from "../components/events/EventCreateCard.jsx";

export default function EventCreatePage() {
  const handleSuccess = (createdEvent) => {
    console.log("Created event:", createdEvent);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <EventCreateCard onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
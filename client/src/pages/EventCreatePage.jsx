import React from "react";
import Navbar from "../components/events/Navbar.jsx"; 
import { EventCreateCard } from "../components/events/EventCreateCard.jsx";

export default function EventCreatePage() {
  const handleSuccess = (createdEvent) => {
    console.log("Created event:", createdEvent);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar at top */}
      <Navbar />

      {/* Center the content */}
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <EventCreateCard onSuccess={handleSuccess} />
        </div>
      </main>
    </div>
  );
}

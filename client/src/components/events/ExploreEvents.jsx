import React from "react";
import Navbar from "./Navbar.jsx";
import HeroSearch from "./HeroSearch.jsx";
import Filters from "./Filters.jsx";
import EventCard from "./EventCard.jsx";

export default function ExploreEvents() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        <HeroSearch />
        <Filters />

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto my-12 px-4">
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <EventCard key={id} />
          ))}
        </div>
      </main>

      {/* Footer */}
       {/* Footer */}
      <footer className="text-center py-3 text-gray-600 text-sm bg-white">
        © {new Date().getFullYear()} PopIn. All rights reserved.
      </footer>
    </div>
  );
}


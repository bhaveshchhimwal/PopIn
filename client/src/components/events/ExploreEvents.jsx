import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import HeroSearch from "./HeroSearch.jsx";
import Filters from "./Filters.jsx";
import EventCard from "./EventCard.jsx";
import axios from "../../utils/axiosInstance.js";

export default function ExploreEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/events");
        setEvents(res.data);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <HeroSearch />
        <Filters />

        {loading ? (
          <p className="text-center text-gray-600 mt-10">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">No events found.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto my-12 px-4">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-3 text-gray-600 text-sm bg-white">
        © {new Date().getFullYear()} PopIn. All rights reserved.
      </footer>
    </div>
  );
}

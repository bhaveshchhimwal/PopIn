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

  
  const [filters, setFilters] = useState({
    q: "",
    category: "All",
    page: 1,
    limit: 12,
  });


  const categoryMap = {
    "music and theater": "music",
    music: "music",

    tech: "tech",
    technology: "tech",

    sports: "sports",
    comedy: "comedy",
    education: "education",

    business: "business",

    others: "other",
    other: "other",

    all: null,
  };

  const mapCategoryForApi = (uiCategory) => {
    if (!uiCategory) return undefined;
    const key = String(uiCategory).trim().toLowerCase();

    if (Object.prototype.hasOwnProperty.call(categoryMap, key)) {
      return categoryMap[key]; 
    }
   
    return uiCategory;
  };

  
  const fetchEvents = async (params) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/events", { params });
    
      setEvents(Array.isArray(res.data) ? res.data : res.data.events || []);
    } catch (err) {
      console.error("fetchEvents error:", err);
      setError("Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const handler = setTimeout(() => {
    
      const params = {};
      if (filters.q) params.q = filters.q;

      if (filters.category && filters.category !== "All") {
        const mapped = mapCategoryForApi(filters.category);
        if (mapped) params.category = mapped;
      }

      params.page = filters.page;
      params.limit = filters.limit;

      fetchEvents(params);
    }, 350);

    return () => clearTimeout(handler);
    
  }, [filters.q, filters.category, filters.page, filters.limit]);

  const handleQueryChange = (q) => {
    setFilters((f) => ({ ...f, q, page: 1 }));
  };

  const handleCategoryChange = (category) => {
    setFilters((f) => ({ ...f, category, page: 1 }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <HeroSearch
          value={filters.q}
          onChange={handleQueryChange}
          onSearch={() =>
          
            fetchEvents({
              q: filters.q,
              category:
                filters.category && filters.category !== "All"
                  ? mapCategoryForApi(filters.category)
                  : undefined,
              page: 1,
              limit: filters.limit,
            })
          }
        />
        <Filters category={filters.category} onChange={handleCategoryChange} />

        {loading ? (
          <p className="text-center text-gray-600 mt-10">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">No events found.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto my-12 px-4">
            {events.map((event) => (
              <EventCard key={event._id || event.id} event={event} />
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

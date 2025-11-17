import React, { useState } from "react";
import { Search } from "lucide-react";

export default function HeroSearch() {
  const [query, setQuery] = useState("");

  return (
    <section
      className="bg-cover bg-center text-white py-20 md:py-28 px-4"
      style={{
        backgroundImage: `url('src/assets/hero-bg.jpg')`,
        backgroundColor: "rgba(0,0,0,0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 leading-tight">
          Discover Events For All The Things You Love
        </h1>

        {/* Search Box */}
        <div className="bg-white rounded-lg flex items-center p-3 sm:p-2 shadow-md max-w-3xl mx-auto gap-3">
          {/* Event Search Input */}
          <div className="flex items-center flex-1 px-3">
            <Search className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Event"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none w-full ml-2 text-gray-800 text-sm sm:text-base placeholder-gray-400"
            />
          </div>

          {/* Button */}
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 sm:py-2.5 px-5 rounded-md text-sm sm:text-base transition">
            Find Events
          </button>
        </div>
      </div>
    </section>
  );
}

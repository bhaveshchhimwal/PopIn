import React, { useState } from "react";
import { MapPin, Search } from "lucide-react";

export default function HeroSearch() {
  const [location, setLocation] = useState("Chandigarh, India");
  const [query, setQuery] = useState("");

  return (
    <section
      className="bg-cover bg-center text-white py-24 px-4"
      style={{
        backgroundImage: `url('src/assets/hero-bg.jpg')`,
        backgroundColor: "rgba(0,0,0,0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Discover Events For All The Things You Love
        </h1>

        <div className="bg-white rounded-lg flex items-center p-2 shadow-md max-w-3xl mx-auto">
          <div className="flex items-center gap-2 px-3 border-r">
            <MapPin className="text-gray-500" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="outline-none text-gray-800 w-40"
            />
          </div>

          <div className="flex items-center flex-1 px-3">
            <Search className="text-gray-500" />
            <input
              type="text"
              placeholder="Search Event"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none w-full ml-2 text-gray-800"
            />
          </div>

          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg">
            Find Events
          </button>
        </div>
      </div>
    </section>
  );
}

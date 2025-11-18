import React from "react";
import { Search } from "lucide-react";
import HeroImg from "../../assets/hero-bg.jpg";
export default function HeroSearch({ value = "", onChange, onSearch }) {
  return (
    <section
      className="bg-cover bg-center text-white py-20 md:py-28 px-4"
      style={{
        backgroundImage: `url(${HeroImg})`,
        backgroundColor: "rgba(0,0,0,0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 leading-tight">
          Discover Events For All The Things You Love
        </h1>

        <div className="bg-white rounded-lg flex items-center p-3 sm:p-2 shadow-md max-w-3xl mx-auto gap-3">
          <div className="flex items-center flex-1 px-3">
            <Search className="text-gray-500 w-5 h-5" />

            <input
              type="text"
              placeholder="Search Event"
              value={value}
              onChange={(e) => onChange && onChange(e.target.value)}

              onKeyDown={(e) => {
                if (e.key === "Enter" && onSearch) onSearch();
              }}

              className="outline-none w-full ml-2 text-gray-800 text-sm sm:text-base placeholder-gray-400"
            />
          </div>

          <button
            onClick={() => onSearch && onSearch()}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 sm:py-2.5 px-5 rounded-md text-sm sm:text-base transition"
          >
            Find Events
          </button>
        </div>
      </div>
    </section>
  );
}

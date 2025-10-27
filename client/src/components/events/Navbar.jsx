import React, { useState } from "react";
import { CalendarDays, PlusCircle, Menu, X } from "lucide-react";
import Logo from "../logo/Logo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-[52px]">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center text-gray-700 font-medium text-[14.5px]">
          <div className="flex items-center gap-6 mr-4">
            <a
              href="#explore"
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              <CalendarDays size={15} />
              Explore Events
            </a>

            <a
              href="#create"
              className="flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold transition"
            >
              <PlusCircle size={15} />
              Create Event
            </a>
          </div>

          {/* Profile on extreme right */}
          <a href="/profile" className="hover:opacity-80 transition">
            <img
              src="/src/assets/profile.png"
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover"
            />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col items-start p-4 gap-3 text-gray-700 font-medium">
            <a
              href="#explore"
              className="flex items-center gap-2 hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              <CalendarDays size={16} />
              Explore Events
            </a>

            <a
              href="#create"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition"
              onClick={() => setMenuOpen(false)}
            >
              <PlusCircle size={16} />
              Create Event
            </a>

            <a
              href="/profile"
              className="flex items-center gap-2 hover:text-gray-800 transition"
              onClick={() => setMenuOpen(false)}
            >
              <img
                src="/src/assets/profile.png"
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover"
              />
              Profile
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

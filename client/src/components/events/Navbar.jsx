import React, { useState } from "react";
import { CalendarDays, PlusCircle, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../logo/Logo";
import axios from "../../utils/axiosInstance.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const { showToast } = useToast();

  const goToProfile = () => {
    setProfileOpen(false);
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      await axios.post("/seller/logout", {}, { withCredentials: true });
    } catch {}

    try {
      await axios.post("/logout", {}, { withCredentials: true });
    } catch {}

    showToast?.("Logged out successfully!", "success");

    setProfileOpen(false);
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-[52px]">
        <div className="flex items-center">
          <Logo />
        </div>

        <div className="hidden md:flex items-center text-gray-700 font-medium text-[14.5px] flex-1 justify-end">
          <div className="flex items-center gap-6 mr-6">
            <a
              href="/events"
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              <CalendarDays size={15} />
              Explore Events
            </a>

            <button
              onClick={() => navigate("/events/create")}
              className="flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold transition"
            >
              <PlusCircle size={15} />
              Create Event
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setProfileOpen((s) => !s)}
              className="hover:opacity-80 transition rounded-full"
            >
              <img
                src="/src/assets/profile.png"
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg py-2 z-50">
                <button
                  onClick={goToProfile}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50"
                >
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col items-start p-4 gap-3 text-gray-700 font-medium">
            <a
              href="/events"
              className="flex items-center gap-2 hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              <CalendarDays size={16} />
              Explore Events
            </a>

            <button
              onClick={() => {
                navigate("/events/create");
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition"
            >
              <PlusCircle size={16} />
              Create Event
            </button>

            <div className="w-full border-t pt-3">
              <button
                onClick={() => {
                  goToProfile();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 hover:text-gray-800 transition px-2 py-2"
              >
                <img
                  src="/src/assets/profile.png"
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover"
                />
                My Profile
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-2 py-2 hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

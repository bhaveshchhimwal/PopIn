import React from "react";
import { ShoppingBag, CalendarPlus, Ticket, User } from "lucide-react";
import Logo from "../logo/Logo";

const LandingPage = () => {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-3 sm:px-5 py-1.5 border-b border-slate-200 shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="shrink-0 scale-90 sm:scale-100">
          <Logo />
        </div>
        <nav className="flex items-center gap-2 sm:gap-3">
          <a className="hover:opacity-80" href="/">
            <img
              src="/src/assets/profile.png"
              alt="Profile"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center text-center text-white py-20 sm:py-28 px-4 bg-cover bg-center"
        style={{
          backgroundImage: "url('src/assets/image.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-xl sm:max-w-2xl px-2">
          <h2 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-5">
            Your Event, Your Audience
          </h2>
          <p className="text-base sm:text-lg text-gray-200 mb-8">
            PopIn makes it simple to buy tickets or host your own events.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center">
            <a
              href="/auth/login"
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md inline-flex items-center justify-center transition text-sm sm:text-base"
            >
              <ShoppingBag className="w-5 h-5 mr-2" /> Buy Tickets
            </a>
            <a
              href="/seller/login"
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md inline-flex items-center justify-center transition text-sm sm:text-base"
            >
              <CalendarPlus className="w-5 h-5 mr-2" /> Add Event
            </a>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <main className="flex-grow bg-gray-50">
        <section
          id="aboutus"
          className="py-10 sm:py-16 px-6 sm:px-10 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-center max-w-6xl mx-auto"
        >
          <div className="p-6 shadow rounded-lg bg-white hover:shadow-md transition">
            <Ticket className="w-10 h-10 mx-auto text-blue-600 mb-4" />
            <h3 className="font-bold text-lg">Easy Ticketing</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Buy and book tickets with just a few clicks.
            </p>
          </div>

          <div className="p-6 shadow rounded-lg bg-white hover:shadow-md transition">
            <User className="w-10 h-10 mx-auto text-green-600 mb-4" />
            <h3 className="font-bold text-lg">For Sellers</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Create and manage events, and track ticket sales all in one place.
            </p>
          </div>

          <div className="p-6 shadow rounded-lg bg-white hover:shadow-md transition sm:col-span-2 md:col-span-1">
            <ShoppingBag className="w-10 h-10 mx-auto text-purple-600 mb-4" />
            <h3 className="font-bold text-lg">For Buyers</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Find and book tickets for your favorite events easily.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-3 bg-gray-100 text-gray-600 text-xs sm:text-sm">
        © {new Date().getFullYear()} PopIn. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;

import React from "react";
import { ShoppingBag, CalendarPlus, Ticket, User } from "lucide-react";
import Logo from "../logo/Logo"

const LandingPage = () => {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      <header className="flex justify-between items-center px-3 md:px-4 py-1.5 border-b border-slate-200 shadow-[0_1px_0_0_rgba(0,0,0,0.03)] leading-none">
        <div className="shrink-0">
          <Logo />
        </div>
        <nav className="flex items-center gap-3">
          <a className="hover:opacity-80">
            <img src="/src/assets/profile.png" alt="Login" className="w-4.5 h-4.5 md:w-5 md:h-5" />
          </a>
        </nav>
      </header>


      <main className="flex-grow">
        <section className="text-center py-16 bg-gray-50">
          <h2 className="text-4xl font-bold mb-4">Your Event, Your Audience</h2>
          <p className="text-lg text-gray-600 mb-6">
            PopIn is the easiest way to buy tickets or add your own events.
          </p>
          <div className="space-x-4">
            <a
              href="/auth/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 inline-flex items-center"
            >
              <ShoppingBag className="w-5 h-5 mr-2" /> Buy Tickets
            </a>
            <a
              href="/seller/login"
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 inline-flex items-center"
            >
              <CalendarPlus className="w-5 h-5 mr-2" /> Add Event
            </a>
          </div>
        </section>

        <section id="aboutus" className="py-12 px-8 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 shadow rounded-lg bg-white">
            <Ticket className="w-10 h-10 mx-auto text-blue-600 mb-4" />
            <h3 className="font-bold text-lg">Easy Ticketing</h3>
            <p className="text-gray-600">Buy and book tickets with just a few clicks.</p>
          </div>

          <div className="p-6 shadow rounded-lg bg-white">
            <User className="w-10 h-10 mx-auto text-green-600 mb-4" />
            <h3 className="font-bold text-lg">For Sellers</h3>
            <p className="text-gray-600">Create and manage events, and track ticket sales all in one place.</p>
          </div>

          <div className="p-6 shadow rounded-lg bg-white">
            <ShoppingBag className="w-10 h-10 mx-auto text-purple-600 mb-4" />
            <h3 className="font-bold text-lg">For Buyers</h3>
            <p className="text-gray-600">Find and book tickets for your favorite events.</p>
          </div>
        </section>
      </main>

      <footer className="text-center py-2 bg-gray-100 text-gray-600 mt-auto">
        © {new Date().getFullYear()} PopIn. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/home/LandingPage";
import AuthLayoutBuyer from "./components/auth/authbuyer/AuthPage.jsx";
import AuthLayoutSeller from "./components/auth/authseller/AuthPage.jsx";
import ExploreEvents from "./components/events/ExploreEvents.jsx";
import { ToastProvider } from "./context/ToastContext"; // Toast context provider

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Home */}
          <Route path="/" element={<LandingPage />} />

          {/* Buyer Authentication */}
          <Route path="/auth/login" element={<AuthLayoutBuyer defaultMode="login" />} />
          <Route path="/auth/register" element={<AuthLayoutBuyer defaultMode="register" />} />

          {/* Seller Authentication */}
          <Route path="/seller/login" element={<AuthLayoutSeller defaultMode="login" />} />
          <Route path="/seller/register" element={<AuthLayoutSeller defaultMode="signup" />} />

          {/* Event Pages */}
          <Route path="/events" element={<ExploreEvents />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

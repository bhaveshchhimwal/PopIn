// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import LandingPage from "./pages/LandingPage";
import AuthLayoutBuyer from "./components/auth/authbuyer/AuthPage.jsx";
import AuthLayoutSeller from "./components/auth/authseller/AuthPage.jsx";
import ExploreEvents from "./components/events/ExploreEvents.jsx";
import EventCreatePage from "./pages/EventCreatePage.jsx";
import EventDetail from "./pages/EventDetailPage.jsx";
import RequireAuth from "./components/auth/RequireAuth.jsx";
import { ToastProvider } from "./context/ToastContext";
import ProfilePage from "./pages/ProfilePage.jsx";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/buyer/login" element={<AuthLayoutBuyer defaultMode="login" />} />
          <Route path="/buyer/register" element={<AuthLayoutBuyer defaultMode="register" />} />

          <Route path="/seller/login" element={<AuthLayoutSeller defaultMode="login" />} />
          <Route path="/seller/register" element={<AuthLayoutSeller defaultMode="signup" />} />

          <Route element={<RequireAuth />}>
            <Route path="/events" element={<ExploreEvents />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route element={<RequireAuth userType="seller" />}>
            <Route path="/events/create" element={<EventCreatePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

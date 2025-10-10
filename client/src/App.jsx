// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AuthLayoutBuyer from "./components/AuthLayoutBuyer";
import AuthLayoutSeller from "./components/AuthLayoutSeller";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Buyer auth */}
        <Route path="/auth/login" element={<AuthLayoutBuyer defaultMode="login" />} />
        <Route path="/auth/register" element={<AuthLayoutBuyer defaultMode="register" />} />

        {/* Seller auth */}
        <Route path="/seller/login" element={<AuthLayoutSeller defaultMode="login" />} />
        <Route path="/seller/register" element={<AuthLayoutSeller defaultMode="register" />} />
      </Routes>
    </BrowserRouter>
  );
}

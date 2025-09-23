import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import { lazy, Suspense } from "react";

const AuthLayout = lazy(() => import("./components/AuthLayout"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-8">Loading…</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<AuthLayout defaultMode="login" />} />
          <Route path="/auth/register" element={<AuthLayout defaultMode="register" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

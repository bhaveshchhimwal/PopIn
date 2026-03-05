import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AuthLayoutBuyer from "../components/auth/authbuyer/AuthPage.jsx";
import AuthLayoutSeller from "../components/auth/authseller/AuthPage.jsx";
import ExploreEvents from "../pages/ExploreEvents.jsx";
import EventCreatePage from "../pages/EventCreatePage.jsx";
import EventDetail from "../pages/EventDetailPage.jsx";
import RequireAuth from "../route-guards/RequireAuth.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import PaymentFailed from "../pages/PaymentFailed.jsx";
import RequirePaymentSession from "../route-guards/RequirePaymentSession.jsx";

export default function AppRoutes() {
  return (
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

      <Route element={<RequireAuth />}>
        <Route element={<RequirePaymentSession />}>
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
        </Route>
      </Route>

      <Route element={<RequireAuth userType="seller" />}>
        <Route path="/events/create" element={<EventCreatePage />} />
      </Route>
    </Routes>
  );
}
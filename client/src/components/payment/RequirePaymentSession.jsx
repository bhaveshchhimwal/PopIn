import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RequirePaymentSession() {
  const location = useLocation();
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentSession = params.get("payment_session");
    
    if (paymentSession === "true") {
      setHasSession(true);
    }
  }, [location]);

  if (!hasSession) {
    return <Navigate to="/events" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
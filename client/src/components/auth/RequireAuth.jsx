import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "../../utils/axiosInstance";

export default function RequireAuth({ userType = "buyer" }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const endpoint = userType === "seller" ? "/api/seller/me" : "/api/user/me";
    
    axios
      .get(endpoint, { withCredentials: true })
      .then(() => mounted && setAuthed(true))
      .catch(() => mounted && setAuthed(false))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [userType]);

  if (loading) return <div>Checking authentication…</div>;
  
  if (!authed) {
    const loginPath = userType === "seller" ? "/seller/login" : "/buyer/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  
  return <Outlet />;
}
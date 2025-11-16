import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "../../utils/axiosInstance";

export default function RequireAuth({ userType = "buyer" }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const endpoint = userType === "seller" ? "/seller/me" : "/user/me";
    
    // Always check auth - the cookie will be sent automatically
    axios
      .get(endpoint, { withCredentials: true })
      .then(() => {
        if (mounted) {
          setAuthed(true);
        }
      })
      .catch((error) => {
        if (mounted) {
          setAuthed(false);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [userType]); // Only re-check if userType changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Checking authentication...</div>
      </div>
    );
  }
  
  if (!authed) {
    const loginPath = userType === "seller" ? "/seller/login" : "/buyer/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  
  return <Outlet />;
}
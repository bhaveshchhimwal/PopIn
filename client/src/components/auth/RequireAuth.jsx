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

    axios
      .get(endpoint, { withCredentials: true })
      .then(() => {
        if (mounted) setAuthed(true);
      })
      .catch(() => {
        if (mounted) setAuthed(false);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [userType]);


  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!authed) {
    const loginPath =
      userType === "seller" ? "/seller/login" : "/buyer/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

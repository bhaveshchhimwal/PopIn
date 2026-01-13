import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../utils/axiosInstance";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [status, setStatus] = useState("processing");

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      setTimeout(() => navigate("/payment/failed"), 2000);
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.get(
          `/payments/verify-session?sessionId=${sessionId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setStatus("success");
          setTimeout(() => navigate("/profile"), 2000);
        } else {
          setStatus("failed");
          setTimeout(() => navigate("/payment/failed"), 2000);
        }
      } catch {
        setStatus("failed");
        setTimeout(() => navigate("/payment/failed"), 2000);
      }
    };

    verify();
  }, [sessionId, navigate]);

  if (status === "processing") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg px-5 py-7 sm:px-8 sm:py-9 text-center">
 
          <div className="mx-auto flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-green-100">
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="mt-4 text-base sm:text-lg font-semibold text-gray-900">
            Payment confirmed
          </h2>

          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Your payment has been successfully processed.
          </p>

          <p className="mt-4 text-xs sm:text-sm text-gray-500">
            Redirecting you to your profile…
          </p>
        </div>
      </div>
    );
  }

  return null;
}

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
          setTimeout(() => navigate("/profile"), 4500);
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
            Payment Confirmed!
          </h2>

          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Your payment has been successfully processed.
          </p>

          <div className="mt-5 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <svg
                className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-medium text-blue-900">
                  Check your email for tickets
                </p>
                <p className="mt-1 text-xs text-blue-700">
                  Your tickets with QR codes have been sent to your email. Don't forget to check your spam folder if you don't see it.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-gray-500">
            Redirecting you to your profile…
          </p>
        </div>
      </div>
    );
  }

  return null;
}
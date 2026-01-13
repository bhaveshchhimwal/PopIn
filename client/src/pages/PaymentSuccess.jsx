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
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-xs sm:max-w-sm text-center">
          <p className="text-base sm:text-lg font-medium text-gray-700">
            Verifying your payment
          </p>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Please wait, this will only take a moment.
          </p>
        </div>
      </div>
    );
  }


  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-xs sm:max-w-sm bg-white p-6 sm:p-8 rounded-xl shadow-md text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-green-600">
            Payment successful
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            You will be redirected to your profile shortly.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

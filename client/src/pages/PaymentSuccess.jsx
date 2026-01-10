
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../utils/axiosInstance";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [status, setStatus] = useState("processing"); 
  // processing | success | failed

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
      <div className="min-h-screen flex items-center justify-center">
        Processing your payment...
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Payment successful</h2>
          <p className="mt-2">Redirecting to profile...</p>
        </div>
      </div>
    );
  }

  return null;
}

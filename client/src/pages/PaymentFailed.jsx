import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-red-600 text-xl mb-4">
        Tickets are no longer available. Any amount deducted will be refunded.
      </h2>
      <button
        onClick={() => navigate("/events")}
        className="bg-slate-800 text-white px-4 py-2 rounded"
      >
        Back to events
      </button>
    </div>
  );
}

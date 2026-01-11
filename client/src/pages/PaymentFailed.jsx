import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h2 className="text-red-600 text-lg sm:text-xl font-semibold mb-4">
          Tickets are no longer available.
        </h2>

        <p className="text-gray-600 text-sm sm:text-base mb-6">
          If any amount was deducted, it will be refunded automatically.
        </p>

        <button
          onClick={() => navigate("/events")}
          className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg text-sm sm:text-base transition"
        >
          Back to events
        </button>
      </div>
    </div>
  );
}

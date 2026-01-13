import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg px-5 py-7 sm:px-8 sm:py-9 text-center">
        
    
        <div className="mx-auto flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-red-100">
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h2 className="mt-4 text-base sm:text-lg font-semibold text-gray-900">
          Tickets unavailable
        </h2>

        <p className="mt-2 text-sm sm:text-base text-gray-600">
          The selected tickets are no longer available.
        </p>

        <p className="mt-3 text-xs sm:text-sm text-gray-500">
          If any amount was deducted, it will be refunded automatically.
        </p>

        <button
          onClick={() => navigate("/events")}
          className="mt-6 w-full rounded-lg bg-slate-800 hover:bg-slate-900 text-white py-3 text-sm sm:text-base font-medium transition"
        >
          Back to events
        </button>
      </div>
    </div>
  );
}

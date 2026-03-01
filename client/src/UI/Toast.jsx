import React, { useEffect } from "react";
export default function Toast({ message, type = "info", onClose = () => {}, duration = 3000 }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(), duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const bgColor =
    type === "error" ? "bg-red-600" : type === "success" ? "bg-green-600" : "bg-blue-600";

  return (

    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 sm:top-5 sm:right-5 z-[9999] pointer-events-none"
      style={{ maxWidth: "calc(100vw - 32px)" }}
    >
      <div
        className={`${bgColor} text-white rounded-md shadow-lg px-4 py-2 sm:px-5 sm:py-3 flex items-start gap-3 pointer-events-auto`}
        style={{
          boxShadow: "0 8px 24px rgba(2,6,23,0.18)",
          maxWidth: 420,
          minWidth: 0,
        }}
      >
        <div className="text-sm sm:text-base leading-tight break-words">{message}</div>

        <button
          onClick={onClose}
          aria-label="Close notification"
          className="ml-2 inline-flex items-center justify-center opacity-90 hover:opacity-100 text-white focus:outline-none"
          style={{
            background: "transparent",
            border: "none",
            padding: 4,
            marginLeft: 8,
            cursor: "pointer",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

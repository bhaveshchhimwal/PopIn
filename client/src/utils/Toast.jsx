
import React, { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
  
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);


  const bgColor =
    type === "error"
      ? "bg-red-500"
      : type === "success"
      ? "bg-green-500"
      : "bg-blue-500";

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-2 text-white rounded shadow-lg ${bgColor} animate-slide-in`}
    >
      {message}
    </div>
  );
}

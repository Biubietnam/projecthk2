// SuccessPopup.jsx
import React, { useEffect } from "react";

const SuccessPopup = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // 3 giây tự ẩn popup
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      {/* Nền mờ */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Popup chính */}
      <div
        className="relative bg-white rounded-lg shadow-lg p-6 max-w-xs w-full mx-4 text-center
                      animate-fade-in-up
                      border-2 border-green-500"
      >
        <div className="flex flex-col items-center gap-2">
          {/* Icon check */}
          <svg
            className="w-12 h-12 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>

          <h3 className="text-green-700 text-xl font-semibold">
            🐾📆 Appointment booked successfully!
          </h3>
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;

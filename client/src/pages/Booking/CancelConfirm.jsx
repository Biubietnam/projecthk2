import React from "react";

const CancelConfirm = ({ message, onConfirm, onCancel, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
        <p className="text-gray-800 text-sm mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={`px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 bg-red-500 text-white rounded-md text-sm transition ${
              isLoading
                ? "bg-red-300 cursor-wait"
                : "hover:bg-red-600 cursor-pointer"
            }`}
          >
            {isLoading ? "Canceling..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirm;

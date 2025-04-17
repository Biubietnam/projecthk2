// Thuc
import React from "react";

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  showConfirm = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>

        <div className="text-sm text-gray-700 mb-6">{children}</div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm text-gray-700"
          >
            Canclel
          </button>

          {showConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-sm text-white"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

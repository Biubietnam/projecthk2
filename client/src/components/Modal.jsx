"use client"
import Button from "../components/Button"
import { X } from "lucide-react"

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  showConfirm = false,
  showCancel = true,
}) {
  if (!isOpen) return null

  return (
    <div className="App fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-winky">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4 pr-8">{title}</h2>

        <div className="text-sm text-gray-700 mb-6">{children}</div>

        <div className="flex justify-end gap-3">
          {showConfirm && (
            <button onClick={onConfirm} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-sm text-white">
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

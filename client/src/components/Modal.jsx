"use client"
//Thuc
import { X } from "lucide-react"

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 pb-0 relative max-h-[90vh] overflow-y-auto m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>

        <div className="text-sm text-gray-700 mb-6 flex flex-col items-center">{children}</div>
      </div>
    </div>
  )
}

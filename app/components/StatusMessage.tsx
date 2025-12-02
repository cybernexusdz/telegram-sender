"use client"

import { CheckCircle, XCircle } from "lucide-react"
import { useEffect } from "react"

interface StatusMessageProps {
  type: "success" | "error"
  message: string
  onClose: () => void
}

export function StatusMessage({ type, message, onClose }: StatusMessageProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 max-w-md w-full rounded-lg shadow-lg p-4 flex items-start gap-3 ${
        type === "success"
          ? "bg-green-50 border border-green-200"
          : "bg-red-50 border border-red-200"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            type === "success" ? "text-green-800" : "text-red-800"
          }`}
        >
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className={`text-sm font-medium ${
          type === "success"
            ? "text-green-600 hover:text-green-800"
            : "text-red-600 hover:text-red-800"
        }`}
      >
        ×
      </button>
    </div>
  )
}

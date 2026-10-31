"use client"

import { CheckCircle2, X, XCircle } from "lucide-react"
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
      className={`status-message ${type === "success" ? "is-success" : "is-error"}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      {type === "success" ? (
        <CheckCircle2 aria-hidden="true" size={19} />
      ) : (
        <XCircle aria-hidden="true" size={19} />
      )}
      <p>{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="status-close"
        aria-label="Dismiss notification"
      >
        <X aria-hidden="true" size={17} />
      </button>
    </div>
  )
}

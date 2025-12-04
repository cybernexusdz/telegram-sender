"use client"

import { Loader2, MessageSquarePlus, Send } from "lucide-react"
import { useState } from "react"

interface MessageSenderProps {
  onSend: (message: string) => Promise<void>
  disabled: boolean
}

export function MessageSender({ onSend, disabled }: MessageSenderProps) {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    setLoading(true)
    try {
      await onSend(message)
      setMessage("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6"> 
      <div className="flex items-center gap-2 mb-4">
        <MessageSquarePlus className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Send Text Message</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows={4}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            disabled={disabled || loading}
          />
        </div>

        <button
          type="submit"
          disabled={disabled || loading || !message.trim()}
          className="w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  )
}

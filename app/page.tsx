"use client"

import { useState } from "react"
import { StatusMessage } from "./components/StatusMessage"
import { TelegramService } from "./services/telegram"
import { MessageSquare } from "lucide-react"
import { TelegramConfig } from "./components/TelegramConfig"
import { MessageSender } from "./components/MessageSender"
import { ImageSender } from "./components/ImageSender"

interface Status {
  type: "success" | "error"
  message: string
}

export default function Home() {
  const [botToken, setBotToken] = useState("")
  const [chatId, setChatId] = useState("")
  const [threadId, setThreadId] = useState("")
  const [status, setStatus] = useState<Status | null>(null)

  const isConfigValid = botToken.trim() !== "" && chatId.trim() !== ""

  const getTelegramService = () => {
    return new TelegramService({
      botToken,
      chatId,
      threadId: threadId.trim() || undefined,
    })
  }

  const handleSendMessage = async (message: string) => {
    const service = getTelegramService()
    const result = await service.sendTextMessage(message)

    if (result.success) {
      setStatus({ type: "success", message: result.message! })
    } else {
      setStatus({ type: "error", message: result.error! })
    }
  }

  const handleSendImageUrl = async (url: string, caption?: string) => {
    const service = getTelegramService()
    const result = await service.sendPhotoFromUrl(url, caption)

    if (result.success) {
      setStatus({ type: "success", message: result.message! })
    } else {
      setStatus({ type: "error", message: result.error! })
    }
  }

  const handleSendImageFile = async (file: File, caption?: string) => {
    const service = getTelegramService()
    const result = await service.sendPhotoFromFile(file, caption)

    if (result.success) {
      setStatus({ type: "success", message: result.message! })
    } else {
      setStatus({ type: "error", message: result.error! })
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100">
      {status && (
        <StatusMessage
          type={status.type}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <MessageSquare className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Telegram Sender
            </h1>
          </div>
          <p className="text-gray-600">
            Send messages and images to Telegram channels and topics
          </p>
        </header>

        <TelegramConfig
          botToken={botToken}
          chatId={chatId}
          threadId={threadId}
          onBotTokenChange={setBotToken}
          onChatIdChange={setChatId}
          onThreadIdChange={setThreadId}
        />

        {!isConfigValid && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              Please configure your Bot Token and Chat ID to start sending
              messages.
            </p>
          </div>
        )}

        <MessageSender onSend={handleSendMessage} disabled={!isConfigValid} />

        <ImageSender
          onSendUrl={handleSendImageUrl}
          onSendFile={handleSendImageFile}
          disabled={!isConfigValid}
        />
      </div>
    </div>
  )
}

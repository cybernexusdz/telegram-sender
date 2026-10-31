"use client"

import { useEffect, useState } from "react"
import { MessageCircle, Send } from "lucide-react"
import { MessageComposer } from "./components/MessageComposer"
import { StatusMessage } from "./components/StatusMessage"
import { TelegramConfig } from "./components/TelegramConfig"
import { TelegramService } from "./services/telegram"

interface Status {
  type: "success" | "error"
  message: string
}

const BOT_TOKEN_STORAGE_KEY = "telegram-sender-bot-token"

export default function Home() {
  const [botToken, setBotToken] = useState("")
  const [isBotTokenLoaded, setIsBotTokenLoaded] = useState(false)
  const [chatId, setChatId] = useState("")
  const [threadId, setThreadId] = useState("")
  const [status, setStatus] = useState<Status | null>(null)

  useEffect(() => {
    try {
      const savedBotToken = window.localStorage.getItem(BOT_TOKEN_STORAGE_KEY)
      if (savedBotToken) {
        setBotToken(savedBotToken)
      }
      setIsBotTokenLoaded(true)
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? `Unable to load the saved bot token: ${error.message}`
            : "Unable to load the saved bot token from browser storage.",
      })
    }
  }, [])

  useEffect(() => {
    if (!isBotTokenLoaded) return

    try {
      if (botToken) {
        window.localStorage.setItem(BOT_TOKEN_STORAGE_KEY, botToken)
      } else {
        window.localStorage.removeItem(BOT_TOKEN_STORAGE_KEY)
      }
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? `Unable to save the bot token: ${error.message}`
            : "Unable to save the bot token to browser storage.",
      })
    }
  }, [botToken, isBotTokenLoaded])

  const isConfigValid = botToken.trim() !== "" && chatId.trim() !== ""

  const getTelegramService = () =>
    new TelegramService({
      botToken,
      chatId,
      threadId: threadId.trim() || undefined,
    })

  const showResult = (result: Awaited<ReturnType<TelegramService["sendTextMessage"]>>) => {
    if (result.success) {
      setStatus({ type: "success", message: result.message! })
    } else {
      setStatus({ type: "error", message: result.error! })
    }
  }

  const handleSendMessage = async (message: string) => {
    showResult(await getTelegramService().sendTextMessage(message))
  }

  const handleSendReply = async (message: string, messageId: string) => {
    showResult(await getTelegramService().sendReply(message, messageId))
  }

  const handleSendPhotoUrl = async (url: string, caption?: string) => {
    showResult(await getTelegramService().sendPhotoFromUrl(url, caption))
  }

  const handleSendPhotoFile = async (file: File, caption?: string) => {
    showResult(await getTelegramService().sendPhotoFromFile(file, caption))
  }

  const handleSendAnimationUrl = async (url: string, caption?: string) => {
    showResult(await getTelegramService().sendAnimationFromUrl(url, caption))
  }

  const handleSendAnimationFile = async (file: File, caption?: string) => {
    showResult(await getTelegramService().sendAnimationFromFile(file, caption))
  }

  return (
    <main className="app-shell">
      {status && (
        <StatusMessage
          type={status.type}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      )}

      <div className="app-content">
        <header className="app-header">
          <div className="brand-mark" aria-hidden="true">
            <Send size={20} />
          </div>
          <div className="brand-copy">
            <p className="eyebrow">A SIMPLE TELEGRAM TOOL</p>
            <h1>Message delivery, made easy.</h1>
            <p>Send a message, reply, photo, or GIF to any Telegram chat.</p>
          </div>
          <div className="header-decoration" aria-hidden="true">
            <MessageCircle size={76} strokeWidth={1} />
          </div>
        </header>

        <div className="workspace">
          <TelegramConfig
            botToken={botToken}
            chatId={chatId}
            threadId={threadId}
            isConfigured={isConfigValid}
            onBotTokenChange={setBotToken}
            onChatIdChange={setChatId}
            onThreadIdChange={setThreadId}
          />

          <MessageComposer
            disabled={!isConfigValid}
            onSendMessage={handleSendMessage}
            onSendReply={handleSendReply}
            onSendPhotoUrl={handleSendPhotoUrl}
            onSendPhotoFile={handleSendPhotoFile}
            onSendAnimationUrl={handleSendAnimationUrl}
            onSendAnimationFile={handleSendAnimationFile}
          />
        </div>

        <footer className="app-footer">
          <span>Made for quick, reliable Telegram sends.</span>
          <span className="footer-status">
            <span className={`status-dot${isConfigValid ? " is-ready" : ""}`} />
            {isConfigValid ? "Ready to send" : "Configuration needed"}
          </span>
        </footer>
      </div>
    </main>
  )
}

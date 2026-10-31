"use client"

import { useEffect, useState } from "react"
import { MessageCircle, Send } from "lucide-react"
import { MessageComposer } from "./components/MessageComposer"
import { StatusMessage } from "./components/StatusMessage"
import { TelegramConfig } from "./components/TelegramConfig"
import { TelegramService } from "./services/telegram"
import type { SavedDestination } from "./types/telegram"

interface Status {
  type: "success" | "error"
  message: string
}

const BOT_TOKEN_STORAGE_KEY = "telegram-sender-bot-token"
const DESTINATIONS_STORAGE_KEY = "telegram-sender-destinations"

const isSavedDestination = (value: unknown): value is SavedDestination =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  typeof value.id === "string" &&
  "name" in value &&
  typeof value.name === "string" &&
  "chatId" in value &&
  typeof value.chatId === "string" &&
  "threadId" in value &&
  typeof value.threadId === "string"

export default function Home() {
  const [botToken, setBotToken] = useState("")
  const [isBotTokenLoaded, setIsBotTokenLoaded] = useState(false)
  const [destinations, setDestinations] = useState<SavedDestination[]>([])
  const [selectedDestinationId, setSelectedDestinationId] = useState("")
  const [areDestinationsLoaded, setAreDestinationsLoaded] = useState(false)
  const [status, setStatus] = useState<Status | null>(null)

  const selectedDestination = destinations.find(
    (destination) => destination.id === selectedDestinationId,
  )
  const chatId = selectedDestination?.chatId ?? ""
  const threadId = selectedDestination?.threadId ?? ""

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
    try {
      const savedDestinations = window.localStorage.getItem(
        DESTINATIONS_STORAGE_KEY,
      )
      if (savedDestinations) {
        const parsed: unknown = JSON.parse(savedDestinations)
        const parsedDestinations = Array.isArray(parsed)
          ? parsed
          : typeof parsed === "object" &&
              parsed !== null &&
              "destinations" in parsed &&
              Array.isArray(parsed.destinations)
            ? parsed.destinations
            : null
        if (
          !parsedDestinations ||
          !parsedDestinations.every(isSavedDestination)
        ) {
          throw new Error("Saved destinations have an invalid format.")
        }

        const savedSelection =
          typeof parsed === "object" &&
          parsed !== null &&
          "selectedDestinationId" in parsed &&
          typeof parsed.selectedDestinationId === "string"
            ? parsed.selectedDestinationId
            : ""
        setDestinations(parsedDestinations)
        setSelectedDestinationId(
          parsedDestinations.some(
            (destination) => destination.id === savedSelection,
          )
            ? savedSelection
            : parsedDestinations[0]?.id ?? "",
        )
      }
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? `Unable to load saved destinations: ${error.message}`
            : "Unable to load saved destinations from browser storage.",
      })
    } finally {
      setAreDestinationsLoaded(true)
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

  useEffect(() => {
    if (!areDestinationsLoaded) return

    try {
      window.localStorage.setItem(
        DESTINATIONS_STORAGE_KEY,
        JSON.stringify({ destinations, selectedDestinationId }),
      )
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? `Unable to save destinations: ${error.message}`
            : "Unable to save destinations to browser storage.",
      })
    }
  }, [areDestinationsLoaded, destinations, selectedDestinationId])

  const isConfigValid = botToken.trim() !== "" && chatId.trim() !== ""

  const getTelegramService = () =>
    new TelegramService({
      botToken,
      chatId,
      threadId: threadId.trim() || undefined,
    })

  const handleAddDestination = (name: string, newChatId: string) => {
    const trimmedName = name.trim()
    const trimmedChatId = newChatId.trim()
    if (!trimmedName || !trimmedChatId) return false
    if (
      destinations.some(
        (destination) =>
          destination.name.toLocaleLowerCase() ===
          trimmedName.toLocaleLowerCase(),
      )
    ) {
      setStatus({
        type: "error",
        message: "A destination with that name already exists.",
      })
      return false
    }

    const destination: SavedDestination = {
      id: crypto.randomUUID(),
      name: trimmedName,
      chatId: trimmedChatId,
      threadId: "",
    }
    setDestinations((current) => [...current, destination])
    setSelectedDestinationId(destination.id)
    setStatus({ type: "success", message: `${trimmedName} was saved.` })
    return true
  }

  const handleDeleteDestination = (destinationId: string) => {
    const destination = destinations.find((item) => item.id === destinationId)
    const remaining = destinations.filter((item) => item.id !== destinationId)
    setDestinations(remaining)
    if (selectedDestinationId === destinationId) {
      setSelectedDestinationId(remaining[0]?.id ?? "")
    }
    if (destination) {
      setStatus({ type: "success", message: `${destination.name} was removed.` })
    }
  }

  const handleThreadIdChange = (value: string) => {
    if (!selectedDestinationId) return
    setDestinations((current) =>
      current.map((destination) =>
        destination.id === selectedDestinationId
          ? { ...destination, threadId: value }
          : destination,
      ),
    )
  }

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
            isConfigured={isConfigValid}
            destinations={destinations}
            selectedDestinationId={selectedDestinationId}
            onBotTokenChange={setBotToken}
            onSelectDestination={setSelectedDestinationId}
            onAddDestination={handleAddDestination}
            onDeleteDestination={handleDeleteDestination}
          />

          <MessageComposer
            disabled={!isConfigValid}
            threadId={threadId}
            canEditThreadId={Boolean(selectedDestination)}
            onThreadIdChange={handleThreadIdChange}
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

"use client"

import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react"
import { useState, type FormEvent } from "react"
import type { SavedDestination } from "../types/telegram"

interface TelegramConfigProps {
  botToken: string
  isConfigured: boolean
  destinations: SavedDestination[]
  selectedDestinationId: string
  onBotTokenChange: (value: string) => void
  onSelectDestination: (destinationId: string) => void
  onAddDestination: (name: string, chatId: string) => boolean
  onDeleteDestination: (destinationId: string) => void
}

export function TelegramConfig({
  botToken,
  isConfigured,
  destinations,
  selectedDestinationId,
  onBotTokenChange,
  onSelectDestination,
  onAddDestination,
  onDeleteDestination,
}: TelegramConfigProps) {
  const [isTokenVisible, setIsTokenVisible] = useState(false)
  const [destinationName, setDestinationName] = useState("")
  const [destinationChatId, setDestinationChatId] = useState("")
  const selectedDestination = destinations.find(
    (destination) => destination.id === selectedDestinationId,
  )

  const handleAddDestination = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (onAddDestination(destinationName, destinationChatId)) {
      setDestinationName("")
      setDestinationChatId("")
    }
  }

  return (
    <details className="settings-card" open={!isConfigured}>
      <summary className="settings-summary">
        <span className="settings-icon">
          <Settings2 aria-hidden="true" size={18} />
        </span>
        <span className="settings-copy">
          <strong>Destination settings</strong>
          <span>
            {selectedDestination
              ? `${selectedDestination.name} · ${selectedDestination.chatId}`
              : "Add a bot token and save a destination to get started"}
          </span>
        </span>
        <span className={`settings-badge${isConfigured ? " is-configured" : ""}`}>
          {isConfigured ? (
            <>
              <Check aria-hidden="true" size={13} />
              Connected
            </>
          ) : (
            "Setup required"
          )}
        </span>
        <ChevronDown aria-hidden="true" className="settings-chevron" size={18} />
      </summary>

      <div className="settings-fields">
        <div className="field-group token-field">
          <label htmlFor="bot-token">
            Bot token <span>Required</span>
          </label>
          <div className="token-input">
            <input
              id="bot-token"
              type={isTokenVisible ? "text" : "password"}
              autoComplete="off"
              value={botToken}
              onChange={(event) => onBotTokenChange(event.target.value)}
              placeholder="Paste your Telegram bot token"
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => setIsTokenVisible((visible) => !visible)}
              aria-label={isTokenVisible ? "Hide bot token" : "Show bot token"}
            >
              {isTokenVisible ? (
                <EyeOff aria-hidden="true" size={17} />
              ) : (
                <Eye aria-hidden="true" size={17} />
              )}
            </button>
          </div>
          <p className="field-hint">
            Saved in this browser for your next visit.
          </p>
        </div>

        <div className="destination-list field-group">
          <label htmlFor="saved-destination">Saved destinations</label>
          <div className="destination-select-row">
            <select
              id="saved-destination"
              value={selectedDestinationId}
              onChange={(event) => onSelectDestination(event.target.value)}
              disabled={destinations.length === 0}
            >
              {destinations.length === 0 ? (
                <option value="">No destinations saved yet</option>
              ) : (
                destinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name} · {destination.chatId}
                  </option>
                ))
              )}
            </select>
            <button
              type="button"
              className="icon-button delete-destination"
              aria-label={`Delete ${selectedDestination?.name ?? "selected destination"}`}
              title="Delete selected destination"
              disabled={!selectedDestination}
              onClick={() => {
                if (selectedDestination) {
                  onDeleteDestination(selectedDestination.id)
                }
              }}
            >
              <Trash2 aria-hidden="true" size={17} />
            </button>
          </div>
          <p className="field-hint">
            Destinations and their topic IDs are saved in this browser.
          </p>
        </div>

        <form className="destination-create" onSubmit={handleAddDestination}>
          <div className="field-group">
            <label htmlFor="destination-name">Name</label>
            <input
              id="destination-name"
              value={destinationName}
              onChange={(event) => setDestinationName(event.target.value)}
              placeholder="e.g. Team updates"
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="destination-chat-id">Chat ID</label>
            <input
              id="destination-chat-id"
              value={destinationChatId}
              onChange={(event) => setDestinationChatId(event.target.value)}
              placeholder="-1001234567890"
              required
            />
          </div>
          <button
            type="submit"
            className="add-destination-button"
            disabled={!destinationName.trim() || !destinationChatId.trim()}
          >
            <Plus aria-hidden="true" size={16} />
            Save destination
          </button>
        </form>
      </div>
    </details>
  )
}

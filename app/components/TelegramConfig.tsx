"use client"

import { Check, ChevronDown, Eye, EyeOff, Settings2 } from "lucide-react"
import { useState } from "react"

interface TelegramConfigProps {
  botToken: string
  chatId: string
  threadId: string
  isConfigured: boolean
  onBotTokenChange: (value: string) => void
  onChatIdChange: (value: string) => void
  onThreadIdChange: (value: string) => void
}

export function TelegramConfig({
  botToken,
  chatId,
  threadId,
  isConfigured,
  onBotTokenChange,
  onChatIdChange,
  onThreadIdChange,
}: TelegramConfigProps) {
  const [isTokenVisible, setIsTokenVisible] = useState(false)

  return (
    <details className="settings-card" open={!isConfigured}>
      <summary className="settings-summary">
        <span className="settings-icon">
          <Settings2 aria-hidden="true" size={18} />
        </span>
        <span className="settings-copy">
          <strong>Destination settings</strong>
          <span>
            {isConfigured
              ? `Chat ${chatId}`
              : "Add your bot token and chat ID to get started"}
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
        <div className="field-group">
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

        <div className="field-group">
          <label htmlFor="chat-id">
            Chat ID <span>Required</span>
          </label>
          <input
            id="chat-id"
            value={chatId}
            onChange={(event) => onChatIdChange(event.target.value)}
            placeholder="-1001234567890"
          />
        </div>

        <div className="field-group thread-field">
          <label htmlFor="thread-id">
            Topic ID <span>Optional</span>
          </label>
          <input
            id="thread-id"
            value={threadId}
            onChange={(event) => onThreadIdChange(event.target.value)}
            placeholder="Leave blank for the main chat"
          />
        </div>
      </div>
    </details>
  )
}

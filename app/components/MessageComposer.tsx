"use client"

import {
  Film,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  MessageSquareText,
  Paperclip,
  Reply,
  Send,
  SmilePlus,
  Upload,
  Video,
} from "lucide-react"
import { useState } from "react"

type ComposerMode =
  | "message"
  | "reply"
  | "reaction"
  | "photo"
  | "animation"
  | "video"
type MediaSource = "url" | "file"

const reactionEmojis = ["👍", "❤️", "🔥", "🎉", "😂", "😢", "👏", "🤔"]

interface MessageComposerProps {
  disabled: boolean
  threadId: string
  canEditThreadId: boolean
  onThreadIdChange: (value: string) => void
  onSendMessage: (message: string) => Promise<void>
  onSendReply: (message: string, messageId: string) => Promise<void>
  onSetReaction: (messageId: string, emoji: string) => Promise<void>
  onSendPhotoUrl: (url: string, caption?: string) => Promise<void>
  onSendPhotoFile: (file: File, caption?: string) => Promise<void>
  onSendAnimationUrl: (url: string, caption?: string) => Promise<void>
  onSendAnimationFile: (file: File, caption?: string) => Promise<void>
  onSendVideoUrl: (url: string, caption?: string) => Promise<void>
  onSendVideoFile: (file: File, caption?: string) => Promise<void>
}

const modes: { id: ComposerMode; label: string; icon: typeof Send }[] = [
  { id: "message", label: "Message", icon: MessageSquareText },
  { id: "reply", label: "Reply", icon: Reply },
  { id: "reaction", label: "React", icon: SmilePlus },
  { id: "photo", label: "Photo", icon: ImageIcon },
  { id: "animation", label: "GIF", icon: Film },
  { id: "video", label: "Video", icon: Video },
]

export function MessageComposer({
  disabled,
  threadId,
  canEditThreadId,
  onThreadIdChange,
  onSendMessage,
  onSendReply,
  onSetReaction,
  onSendPhotoUrl,
  onSendPhotoFile,
  onSendAnimationUrl,
  onSendAnimationFile,
  onSendVideoUrl,
  onSendVideoFile,
}: MessageComposerProps) {
  const [mode, setMode] = useState<ComposerMode>("message")
  const [mediaSource, setMediaSource] = useState<MediaSource>("url")
  const [message, setMessage] = useState("")
  const [messageId, setMessageId] = useState("")
  const [reactionMessageId, setReactionMessageId] = useState("")
  const [reactionEmoji, setReactionEmoji] = useState(reactionEmojis[0])
  const [mediaUrl, setMediaUrl] = useState("")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [loading, setLoading] = useState(false)

  const isMedia = mode === "photo" || mode === "animation" || mode === "video"
  const isReady = (() => {
    if (mode === "message") return Boolean(message.trim())
    if (mode === "reply") return Boolean(message.trim() && messageId.trim())
    if (mode === "reaction") return Boolean(reactionMessageId.trim())
    return mediaSource === "url" ? Boolean(mediaUrl.trim()) : Boolean(mediaFile)
  })()

  const handleModeChange = (nextMode: ComposerMode) => {
    setMode(nextMode)
    setMediaFile(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (disabled || loading || !isReady) return

    setLoading(true)
    try {
      if (mode === "message") {
        await onSendMessage(message)
        setMessage("")
      } else if (mode === "reply") {
        await onSendReply(message, messageId)
        setMessage("")
        setMessageId("")
      } else if (mode === "reaction") {
        await onSetReaction(reactionMessageId, reactionEmoji)
        setReactionMessageId("")
      } else if (mode === "photo") {
        if (mediaSource === "url") {
          await onSendPhotoUrl(mediaUrl, caption || undefined)
          setMediaUrl("")
        } else if (mediaFile) {
          await onSendPhotoFile(mediaFile, caption || undefined)
          setMediaFile(null)
        }
        setCaption("")
      } else if (mode === "animation") {
        if (mediaSource === "url") {
          await onSendAnimationUrl(mediaUrl, caption || undefined)
          setMediaUrl("")
        } else if (mediaFile) {
          await onSendAnimationFile(mediaFile, caption || undefined)
          setMediaFile(null)
        }
        setCaption("")
      } else if (mode === "video") {
        if (mediaSource === "url") {
          await onSendVideoUrl(mediaUrl, caption || undefined)
          setMediaUrl("")
        } else if (mediaFile) {
          await onSendVideoFile(mediaFile, caption || undefined)
          setMediaFile(null)
        }
        setCaption("")
      }
    } finally {
      setLoading(false)
    }
  }

  const mediaLabel =
    mode === "photo" ? "image" : mode === "video" ? "video" : "GIF"
  const submitLabel =
    mode === "message"
      ? "Send message"
      : mode === "reply"
        ? "Send reply"
        : mode === "reaction"
          ? "Add reaction"
        : `Send ${mediaLabel}`
  const ModeIcon = modes.find((item) => item.id === mode)?.icon ?? Send

  return (
    <section className="composer-card" aria-labelledby="composer-title">
      <div className="composer-heading">
        <div>
          <p className="eyebrow">COMPOSE</p>
          <h2 id="composer-title">What would you like to send?</h2>
        </div>
        <span className="secure-note">
          <Paperclip aria-hidden="true" size={14} />
          Sent directly to Telegram
        </span>
      </div>

      <div className="mode-tabs" role="group" aria-label="Message type">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            className={`mode-tab${mode === id ? " is-active" : ""}`}
            onClick={() => handleModeChange(id)}
          >
            <Icon aria-hidden="true" size={17} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="composer-form"
      >
        <div className="composer-context">
          <label htmlFor="compose-thread-id">Topic ID</label>
          <input
            id="compose-thread-id"
            inputMode="numeric"
            value={threadId}
            onChange={(event) => onThreadIdChange(event.target.value)}
            placeholder="Optional"
            disabled={!canEditThreadId || loading}
            aria-describedby="topic-id-hint"
          />
          <p id="topic-id-hint" className="field-hint">
            Optional · saved with this destination
          </p>
        </div>

        {mode === "message" && (
          <div className="field-group">
            <label htmlFor="compose-message">Message</label>
            <textarea
              id="compose-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write your message..."
              rows={6}
              disabled={disabled || loading}
            />
            <p className="field-hint">Your message will be sent as plain text.</p>
          </div>
        )}

        {mode === "reply" && (
          <>
            <div className="field-group">
              <label htmlFor="reply-message-id">Reply to message ID</label>
              <input
                id="reply-message-id"
                value={messageId}
                onChange={(event) => setMessageId(event.target.value)}
                placeholder="e.g. 123"
                disabled={disabled || loading}
              />
              <p className="field-hint">
                Enter the ID of the message you want to reply to.
              </p>
            </div>
            <div className="field-group">
              <label htmlFor="reply-message">Your reply</label>
              <textarea
                id="reply-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your reply..."
                rows={5}
                disabled={disabled || loading}
              />
            </div>
          </>
        )}

        {mode === "reaction" && (
          <>
            <div className="field-group">
              <label htmlFor="reaction-message-id">Message ID</label>
              <input
                id="reaction-message-id"
                type="number"
                min="1"
                step="1"
                value={reactionMessageId}
                onChange={(event) => setReactionMessageId(event.target.value)}
                placeholder="Enter the message ID"
                disabled={disabled || loading}
              />
              <p className="field-hint">
                Add a reaction to a message in the selected chat.
              </p>
            </div>
            <div className="field-group">
              <span className="field-label">Choose a reaction</span>
              <div className="reaction-picker" role="group" aria-label="Reaction">
                {reactionEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    aria-label={`React with ${emoji}`}
                    aria-pressed={reactionEmoji === emoji}
                    className={reactionEmoji === emoji ? "is-active" : ""}
                    onClick={() => setReactionEmoji(emoji)}
                    disabled={disabled || loading}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {isMedia && (
          <>
            <div className="source-switch" aria-label={`${mediaLabel} source`}>
              <button
                type="button"
                aria-pressed={mediaSource === "url"}
                className={mediaSource === "url" ? "is-active" : ""}
                onClick={() => setMediaSource("url")}
                disabled={loading}
              >
                <LinkIcon aria-hidden="true" size={16} />
                Use a link
              </button>
              <button
                type="button"
                aria-pressed={mediaSource === "file"}
                className={mediaSource === "file" ? "is-active" : ""}
                onClick={() => setMediaSource("file")}
                disabled={loading}
              >
                <Upload aria-hidden="true" size={16} />
                Upload a file
              </button>
            </div>

            {mediaSource === "url" ? (
              <div className="field-group" key="media-url">
                <label htmlFor="media-url">
                  {mode === "photo"
                    ? "Image URL"
                    : mode === "video"
                      ? "Video URL"
                      : "GIF URL"}
                </label>
                <input
                  id="media-url"
                  type="url"
                  value={mediaUrl}
                  onChange={(event) => setMediaUrl(event.target.value)}
                  placeholder="https://example.com/media"
                  disabled={disabled || loading}
                />
              </div>
            ) : (
              <div className="field-group" key="media-file">
                <label htmlFor="media-file">Choose {mediaLabel}</label>
                <input
                  id="media-file"
                  type="file"
                  accept={
                    mode === "photo"
                      ? "image/*"
                      : mode === "video"
                        ? "video/mp4"
                        : "image/gif,video/mp4"
                  }
                  onChange={(event) =>
                    setMediaFile(event.target.files?.[0] ?? null)
                  }
                  disabled={disabled || loading}
                />
                {mediaFile && (
                  <p className="selected-file">{mediaFile.name}</p>
                )}
              </div>
            )}

            <div className="field-group">
              <label htmlFor="media-caption">Caption <span>Optional</span></label>
              <input
                id="media-caption"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Add a caption..."
                disabled={disabled || loading}
              />
            </div>
          </>
        )}

        <div className="composer-footer">
          <p className="field-hint">
            {disabled
              ? "Add your bot token and chat ID in settings to get started."
              : "Double-check your destination before sending."}
          </p>
          <button
            type="submit"
            className="send-button"
            disabled={disabled || loading || !isReady}
          >
            {loading ? (
              <Loader2 aria-hidden="true" size={17} className="spin" />
            ) : (
              <ModeIcon aria-hidden="true" size={17} />
            )}
            {loading ? "Sending..." : submitLabel}
          </button>
        </div>
      </form>
    </section>
  )
}

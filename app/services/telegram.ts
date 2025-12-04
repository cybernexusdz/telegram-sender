import { TelegramConfig, MessageResponse } from "../types/telegram"

const TELEGRAM_API_BASE = "https://api.telegram.org/bot"

export class TelegramService {
  private config: TelegramConfig

  constructor(config: TelegramConfig) {
    this.config = config
  }

  async sendTextMessage(text: string): Promise<MessageResponse> {
    try {
      const url = `${TELEGRAM_API_BASE}${this.config.botToken}/sendMessage`

      const payload: Record<string, string> = {
        chat_id: this.config.chatId,
        text: text,
      }

      if (this.config.threadId) {
        payload.message_thread_id = this.config.threadId
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.description || "Failed to send message",
        }
      }

      return {
        success: true,
        message: "Message sent successfully",
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async sendPhotoFromUrl(
    photoUrl: string,
    caption?: string
  ): Promise<MessageResponse> {
    try {
      const url = `${TELEGRAM_API_BASE}${this.config.botToken}/sendPhoto`

      const payload: Record<string, string> = {
        chat_id: this.config.chatId,
        photo: photoUrl,
      }

      if (caption) {
        payload.caption = caption
      }

      if (this.config.threadId) {
        payload.message_thread_id = this.config.threadId
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.description || "Failed to send photo",
        }
      }

      return {
        success: true,
        message: "Photo sent successfully",
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async sendPhotoFromFile(
    file: File,
    caption?: string
  ): Promise<MessageResponse> {
    try {
      const url = `${TELEGRAM_API_BASE}${this.config.botToken}/sendPhoto`

      const formData = new FormData()
      formData.append("chat_id", this.config.chatId)
      formData.append("photo", file)

      if (caption) {
        formData.append("caption", caption)
      }

      if (this.config.threadId) {
        formData.append("message_thread_id", this.config.threadId)
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.description || "Failed to send photo",
        }
      }

      return {
        success: true,
        message: "Photo sent successfully",
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async sendAnimationFromUrl(
    animationUrl: string,
    caption?: string
  ): Promise<MessageResponse> {
    try {
      const url = `${TELEGRAM_API_BASE}${this.config.botToken}/sendAnimation`

      const payload: Record<string, string> = {
        chat_id: this.config.chatId,
        animation: animationUrl,
      }

      if (caption) {
        payload.caption = caption
      }

      if (this.config.threadId) {
        payload.message_thread_id = this.config.threadId
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.description || "Failed to send GIF",
        }
      }

      return {
        success: true,
        message: "GIF sent successfully",
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async sendAnimationFromFile(
    file: File,
    caption?: string
  ): Promise<MessageResponse> {
    try {
      const url = `${TELEGRAM_API_BASE}${this.config.botToken}/sendAnimation`

      const formData = new FormData()
      formData.append("chat_id", this.config.chatId)
      formData.append("animation", file)

      if (caption) {
        formData.append("caption", caption)
      }

      if (this.config.threadId) {
        formData.append("message_thread_id", this.config.threadId)
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.description || "Failed to send GIF",
        }
      }

      return {
        success: true,
        message: "GIF sent successfully",
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }
}

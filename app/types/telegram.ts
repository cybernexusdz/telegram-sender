export interface TelegramConfig {
  botToken: string
  chatId: string
  threadId?: string
}

export interface MessageResponse {
  success: boolean
  message?: string
  error?: string
}

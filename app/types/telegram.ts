export interface TelegramConfig {
  botToken: string
  chatId: string
  threadId?: string
}

export interface SavedDestination {
  id: string
  name: string
  chatId: string
  threadId: string
}

export interface MessageResponse {
  success: boolean
  message?: string
  error?: string
}

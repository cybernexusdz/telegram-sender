import { Settings } from 'lucide-react';

interface TelegramConfigProps {
  botToken: string;
  chatId: string;
  threadId: string;
  onBotTokenChange: (value: string) => void;
  onChatIdChange: (value: string) => void;
  onThreadIdChange: (value: string) => void;
}

export function TelegramConfig({
  botToken,
  chatId,
  threadId,
  onBotTokenChange,
  onChatIdChange,
  onThreadIdChange,
}: TelegramConfigProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Telegram Configuration</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="botToken" className="block text-sm font-medium text-gray-700 mb-1">
            Bot Token <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="botToken"
            value={botToken}
            onChange={(e) => onBotTokenChange(e.target.value)}
            placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="chatId" className="block text-sm font-medium text-gray-700 mb-1">
            Chat ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="chatId"
            value={chatId}
            onChange={(e) => onChatIdChange(e.target.value)}
            placeholder="-1001234567890"
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="threadId" className="block text-sm font-medium text-gray-700 mb-1">
            Thread ID (Optional)
          </label>
          <input
            type="text"
            id="threadId"
            value={threadId}
            onChange={(e) => onThreadIdChange(e.target.value)}
            placeholder="123"
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <p className="mt-1 text-sm text-gray-500">
            Leave empty for regular channels/groups
          </p>
        </div>
      </div>
    </div>
  );
}

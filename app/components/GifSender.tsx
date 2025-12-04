"use client"

import { useState } from "react"
import { Film, Loader2, Link, Upload } from "lucide-react"

interface GifSenderProps {
  onSendUrl: (url: string, caption?: string) => Promise<void>
  onSendFile: (file: File, caption?: string) => Promise<void>
  disabled: boolean
}

export function GifSender({
  onSendUrl,
  onSendFile,
  disabled,
}: GifSenderProps) {
  const [mode, setMode] = useState<"url" | "file">("url")
  const [gifUrl, setGifUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    try {
      if (mode === "url") {
        if (!gifUrl.trim()) return
        await onSendUrl(gifUrl, caption || undefined)
        setGifUrl("")
      } else {
        if (!selectedFile) return
        await onSendFile(selectedFile, caption || undefined)
        setSelectedFile(null)
      }
      setCaption("")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "image/gif" || file.type === "video/mp4")) {
      setSelectedFile(file)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 my-6">
      <div className="flex items-center gap-2 mb-4">
        <Film className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Send GIF</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            mode === "url"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Link className="w-4 h-4" />
            From URL
          </div>
        </button>
        <button
          type="button"
          onClick={() => setMode("file")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            mode === "file"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" />
            Upload File
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "url" ? (
          <div className="mb-4">
            <label
              htmlFor="gifUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              GIF URL
            </label>
            <input
              type="url"
              id="gifUrl"
              value={gifUrl}
              onChange={(e) => setGifUrl(e.target.value)}
              placeholder="https://example.com/animation.gif"
              className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={disabled || loading}
            />
          </div>
        ) : (
          <div className="mb-4">
            <label
              htmlFor="gifFile"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select GIF
            </label>
            <input
              type="file"
              id="gifFile"
              accept="image/gif,video/mp4"
              onChange={handleFileChange}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={disabled || loading}
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="gifCaption"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Caption (Optional)
          </label>
          <input
            type="text"
            id="gifCaption"
            value={caption || ""}
            onChange={(e) => setCaption(e.target.value || "")}
            placeholder="Add a caption for your GIF..."
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={disabled || loading}
          />
        </div>

        <button
          type="submit"
          disabled={
            disabled ||
            loading ||
            (mode === "url" ? !gifUrl.trim() : !selectedFile)
          }
          className="w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Film className="w-5 h-5" />
              Send GIF
            </>
          )}
        </button>
      </form>
    </div>
  )
}

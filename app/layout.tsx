import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
 
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Telegram Sender",
  description: "Telegram Sender App built with Next.js and TypeScript",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={inter.style}
        className={`${inter.className} antialiased scroll-smooth`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}

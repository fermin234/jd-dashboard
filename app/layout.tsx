import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Dashboard - Juanita Deco",
  description: "Sistema de gestión para tienda física",
  generator: "v0.app",
  icons: [
    {
      url: "/logo-OK-Juanita-Deco-3.png",
      rel: "icon"
    }
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <div className="flex h-screen">
          <Suspense fallback={<div>Loading...</div>}>
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </Suspense>
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}

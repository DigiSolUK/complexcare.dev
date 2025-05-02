import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { GlobalErrorHandler } from "@/components/global-error-handler"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ComplexCare CRM",
  description: "A comprehensive CRM for complex care management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <GlobalErrorHandler />
        {/* Rest of your layout */}
        {children}
      </body>
    </html>
  )
}

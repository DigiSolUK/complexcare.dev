import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { GlobalErrorHandler } from "@/components/global-error-handler"
import { SessionProvider } from "@/components/session-provider" // Ensure this import is present
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ErrorBoundary componentPath="app/layout.tsx">
            <GlobalErrorHandler />
            {/* SessionProvider is required for useSession hook, even if auth is mocked/disabled */}
            <SessionProvider>{children}</SessionProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}

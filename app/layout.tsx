import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GlobalErrorHandler } from "@/components/global-error-handler"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ComplexCare CRM",
  description: "A comprehensive CRM for complex care management in the UK",
  generator: "v0.dev",
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
          <GlobalErrorHandler />
          {/* Emergency recovery notice */}
          {typeof window !== "undefined" && window.location.search.includes("safe_mode=1") && (
            <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white p-2 text-center z-50">
              Emergency Recovery Mode Active - Limited Functionality Available
            </div>
          )}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

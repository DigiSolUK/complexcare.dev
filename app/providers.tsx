"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  )
}

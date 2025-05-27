"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { TenantProvider } from "@/contexts/tenant-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TenantProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </TenantProvider>
    </SessionProvider>
  )
}

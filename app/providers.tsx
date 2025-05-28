"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { TenantProvider } from "@/contexts/tenant-context"
import { ErrorBoundary } from "@/components/error-boundary"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TenantProvider>{children}</TenantProvider>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}

"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { TenantProvider } from "@/contexts"
import { ErrorTrackingProvider } from "@/components/error-tracking-provider"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ErrorTrackingProvider>
        <TenantProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </TenantProvider>
      </ErrorTrackingProvider>
    </SessionProvider>
  )
}

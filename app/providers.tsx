"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { TenantProvider } from "@/lib/tenant-context"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TenantProvider>
        {children}
        <Toaster />
      </TenantProvider>
    </ThemeProvider>
  )
}

"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { TenantProvider } from "@/components/providers/tenant-provider"
import { FeaturesProvider } from "@/lib/features-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TenantProvider>
        <FeaturesProvider>{children}</FeaturesProvider>
      </TenantProvider>
    </ThemeProvider>
  )
}


"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { TenantProvider } from "@/lib/tenant-context"

// Default tenant ID from the sample data
const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c" // ComplexCare Medical Group

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TenantProvider initialTenantId={DEFAULT_TENANT_ID}>{children}</TenantProvider>
    </ThemeProvider>
  )
}

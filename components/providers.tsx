"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { TenantProvider } from "@/lib/tenant-context"
import { DatabaseProvider } from "@/components/database-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <DatabaseProvider>
        <TenantProvider>{children}</TenantProvider>
      </DatabaseProvider>
    </ThemeProvider>
  )
}

"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context" // Updated path
import { TenantProvider } from "@/components/providers/tenant-provider" // Assuming this is still needed
import { ThemeProvider } from "@/components/theme-provider" // Assuming shadcn/ui theme provider
import { Toaster } from "@/components/ui/toaster" // For notifications

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TenantProvider>
          {" "}
          {/* TenantProvider might need to use useAuth to get tenantId */}
          {children}
          <Toaster />
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

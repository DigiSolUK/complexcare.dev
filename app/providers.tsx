"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { AuthProvider } from "@/lib/auth-context" // Correct import

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <AuthProvider>
        {" "}
        {/* Wrap with AuthProvider */}
        {children}
      </AuthProvider>
    </NextThemesProvider>
  )
}

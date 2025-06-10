import type React from "react"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "System Diagnostics",
  description: "System diagnostics and health checks for ComplexCareCRM.",
}

export default function SystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-800 shadow-sm">
              <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                  <a className="flex items-center space-x-2" href="/">
                    {/* You can add an SVG logo here if you have one */}
                    <span className="font-bold text-lg text-gray-800 dark:text-white">
                      ComplexCareCRM - System Diagnostics
                    </span>
                  </a>
                </div>
                {/* Minimal header, no user menu or complex nav for diagnostics */}
              </div>
            </header>
            <main className="flex-1 py-8">{children}</main>
            <footer className="border-t bg-white dark:bg-gray-800">
              <div className="container mx-auto flex flex-col items-center justify-center gap-2 py-6 px-4 sm:px-6 lg:px-8 md:h-20 md:flex-row md:justify-between">
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 md:text-left">
                  &copy; {new Date().getFullYear()} ComplexCareCRM. All rights reserved.
                </p>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">Diagnostic Interface</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

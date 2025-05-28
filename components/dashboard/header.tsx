// If the header component is trying to use session data, update it to not require session
// This is a simplified example - adjust based on your actual header component
"use client"

import Link from "next/link"
import { UserNav } from "@/components/user-nav"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="hidden md:inline-block">ComplexCare CRM</span>
        </Link>
        <div className="flex items-center gap-2">
          <UserNav />
        </div>
      </div>
    </header>
  )
}

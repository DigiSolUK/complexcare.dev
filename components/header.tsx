"use client"

import Link from "next/link"
import { DemoUserMenu } from "@/components/demo-user-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <span className="text-primary">ComplexCare</span>
        <span className="hidden sm:inline">CRM</span>
        <span className="rounded bg-yellow-200 px-1.5 py-0.5 text-xs font-medium text-yellow-700">Demo</span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </Button>
        <ModeToggle />
        <DemoUserMenu />
      </div>
    </header>
  )
}


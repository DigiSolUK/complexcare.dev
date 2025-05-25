"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { Menu } from "lucide-react"

interface HeaderProps {
  toggleSidebar: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">ComplexCare CRM</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  )
}

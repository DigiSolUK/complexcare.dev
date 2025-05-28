"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, Bell, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MobileSidebar } from "./mobile-sidebar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function MobileHeader() {
  const pathname = usePathname()
  const [showSearch, setShowSearch] = useState(false)

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/mobile") return "Dashboard"
    if (pathname.startsWith("/mobile/patients")) return "Patients"
    if (pathname.startsWith("/mobile/appointments")) return "Appointments"
    if (pathname.startsWith("/mobile/tasks")) return "Tasks"
    if (pathname.startsWith("/mobile/notes")) return "Clinical Notes"
    return "ComplexCare"
  }

  return (
    <header className="sticky top-0 z-10 bg-background border-b">
      <div className="flex items-center justify-between px-4 h-14">
        {showSearch ? (
          <div className="flex-1 flex items-center">
            <Input type="search" placeholder="Search..." className="h-9" autoFocus />
            <Button variant="ghost" size="sm" onClick={() => setShowSearch(false)} className="ml-2">
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                  <MobileSidebar />
                </SheetContent>
              </Sheet>
              <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">3</Badge>
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

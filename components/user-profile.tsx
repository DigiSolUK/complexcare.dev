"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function UserProfile() {
  // Demo user data
  const demoUser = {
    name: "Demo User",
    email: "demo@complexcare.dev",
    picture: "/placeholder.svg?height=32&width=32",
  }

  return (
    <div className="flex items-center space-x-4">
      {demoUser.picture && (
        <img src={demoUser.picture || "/placeholder.svg"} alt={demoUser.name} className="h-8 w-8 rounded-full" />
      )}
      <div>
        <p className="text-sm font-medium">{demoUser.name}</p>
        <p className="text-xs text-gray-500">{demoUser.email}</p>
      </div>
      <Link href="/">
        <Button variant="outline" size="sm">
          Demo Mode
        </Button>
      </Link>
    </div>
  )
}


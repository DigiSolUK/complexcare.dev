"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function LiveAppLoginButton() {
  return (
    <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent/10">
      <Link href="/live-login">
        <Icons.lock className="mr-2 h-4 w-4" />
        Live App
      </Link>
    </Button>
  )
}

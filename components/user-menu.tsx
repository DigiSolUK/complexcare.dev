"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useTenant } from "@/contexts"

export function UserMenu() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { tenant } = useTenant()

  async function handleSignOut() {
    await signOut()
    router.push("/login")
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User Avatar"} />
            <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
        <DropdownMenuItem disabled>{session?.user?.email}</DropdownMenuItem>
        <DropdownMenuSeparator />
        {tenant && <DropdownMenuItem onClick={() => router.push(`/${tenant.slug}/admin`)}>Dashboard</DropdownMenuItem>}
        <DropdownMenuItem onClick={() => router.push("/account")}>Account Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

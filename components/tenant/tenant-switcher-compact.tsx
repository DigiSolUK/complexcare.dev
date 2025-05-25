"use client"

import { useState } from "react"
import { Building, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTenant } from "@/contexts"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export function TenantSwitcherCompact() {
  const [switching, setSwitching] = useState(false)
  const { currentTenant, tenants, isLoading, switchTenant } = useTenant()

  const handleSwitchTenant = async (tenantId: string) => {
    if (currentTenant?.id === tenantId) {
      return
    }

    try {
      setSwitching(true)
      await switchTenant(tenantId)
      toast({
        title: "Tenant switched",
        description: "Successfully switched tenant",
      })
    } catch (error) {
      console.error("Failed to switch tenant:", error)
      toast({
        title: "Error switching tenant",
        description: "There was a problem switching tenants. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSwitching(false)
    }
  }

  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />
  }

  if (!currentTenant) {
    return null
  }

  const initials = currentTenant.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" disabled={switching}>
          {switching ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Avatar className="h-8 w-8">
              {currentTenant.logo_url ? (
                <AvatarImage src={currentTenant.logo_url || "/placeholder.svg"} alt={currentTenant.name} />
              ) : (
                <AvatarFallback>{initials || <Building className="h-4 w-4" />}</AvatarFallback>
              )}
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Switch Tenant</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tenants.map((tenant) => {
          const tenantInitials = tenant.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)

          return (
            <DropdownMenuItem
              key={tenant.id}
              onClick={() => handleSwitchTenant(tenant.id)}
              disabled={switching}
              className={tenant.id === currentTenant.id ? "bg-accent" : ""}
            >
              <Avatar className="h-6 w-6 mr-2">
                {tenant.logo_url ? (
                  <AvatarImage src={tenant.logo_url || "/placeholder.svg"} alt={tenant.name} />
                ) : (
                  <AvatarFallback className="text-xs">
                    {tenantInitials || <Building className="h-3 w-3" />}
                  </AvatarFallback>
                )}
              </Avatar>
              <span>{tenant.name}</span>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => (window.location.href = "/admin/tenant-management")}>
          Manage Tenants
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

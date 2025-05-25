"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, PlusCircle, Building, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTenant } from "@/contexts"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

export function TenantSwitcher() {
  const [open, setOpen] = useState(false)
  const [switching, setSwitching] = useState(false)
  const { currentTenant, tenants, isLoading, switchTenant } = useTenant()

  const handleSwitchTenant = async (tenantId: string) => {
    if (currentTenant?.id === tenantId) {
      setOpen(false)
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
      setOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    )
  }

  if (!currentTenant) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a tenant"
          className="w-[220px] justify-between"
          disabled={switching}
        >
          <div className="flex items-center gap-2 truncate">
            <TenantAvatar tenant={currentTenant} />
            <div className="flex flex-col items-start">
              <span className="truncate font-medium">{currentTenant.name}</span>
              {currentTenant.plan && (
                <Badge variant="outline" className="text-xs font-normal">
                  {currentTenant.plan}
                </Badge>
              )}
            </div>
          </div>
          {switching ? (
            <Loader2 className="ml-auto h-4 w-4 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search tenant..." />
            <CommandEmpty>No tenant found.</CommandEmpty>
            <CommandGroup heading="Your tenants">
              {tenants.map((tenant) => (
                <CommandItem
                  key={tenant.id}
                  onSelect={() => handleSwitchTenant(tenant.id)}
                  className="text-sm"
                  disabled={switching}
                >
                  <TenantAvatar tenant={tenant} className="mr-2" />
                  <span className="truncate flex-1">{tenant.name}</span>
                  {tenant.id === currentTenant.id && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  window.location.href = "/admin/tenant-management"
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Manage Tenants
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface TenantAvatarProps {
  tenant: {
    id: string
    name: string
    logo_url?: string
  }
  className?: string
}

function TenantAvatar({ tenant, className = "" }: TenantAvatarProps) {
  const initials = tenant.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <Avatar className={`h-6 w-6 ${className}`}>
      {tenant.logo_url ? (
        <AvatarImage src={tenant.logo_url || "/placeholder.svg"} alt={tenant.name} />
      ) : (
        <AvatarFallback className="text-xs">{initials || <Building className="h-3 w-3" />}</AvatarFallback>
      )}
    </Avatar>
  )
}

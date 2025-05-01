"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, PlusCircle, Building } from "lucide-react"
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
import { useTenant } from "@/lib/tenant-context"
import { Skeleton } from "@/components/ui/skeleton"

export function TenantSwitcher() {
  const [open, setOpen] = useState(false)
  const { currentTenant, tenants, isLoading, switchTenant } = useTenant()

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
          className="w-[200px] justify-between"
        >
          <div className="flex items-center gap-2 truncate">
            <Building className="h-4 w-4" />
            <span className="truncate">{currentTenant.name}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search tenant..." />
            <CommandEmpty>No tenant found.</CommandEmpty>
            <CommandGroup heading="Tenants">
              {tenants.map((tenant) => (
                <CommandItem
                  key={tenant.id}
                  onSelect={() => {
                    switchTenant(tenant.id)
                    setOpen(false)
                  }}
                  className="text-sm"
                >
                  <Building className="mr-2 h-4 w-4" />
                  <span className="truncate">{tenant.name}</span>
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
                  window.location.href = "/superadmin/tenants"
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

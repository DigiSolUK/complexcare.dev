"use client"

import { useTenant } from "@/contexts"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Tenant {
  id: string
  name: string
  slug: string
  imageUrl?: string
}

interface TenantSwitcherProps {
  tenants: Tenant[]
}

export function TenantSwitcher({ tenants }: TenantSwitcherProps) {
  const router = useRouter()
  const { tenant, setTenant } = useTenant()
  const [open, setOpen] = useState(false)

  const currentTenant = tenants.find((t) => t.id === tenant?.id)

  const onSelect = (tenant: Tenant) => {
    setTenant(tenant)
    setOpen(false)
    router.push(`/${tenant.slug}`)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2" aria-label="Open tenant switcher">
          <Avatar className="h-8 w-8">
            {currentTenant?.imageUrl ? (
              <AvatarImage src={currentTenant.imageUrl || "/placeholder.svg"} alt={currentTenant.name} />
            ) : (
              <AvatarFallback>{currentTenant?.name.substring(0, 2)}</AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium hidden md:block">{currentTenant?.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        {tenants.map((tenant) => (
          <DropdownMenuItem key={tenant.id} onSelect={() => onSelect(tenant)}>
            <Avatar className="mr-2 h-6 w-6">
              {tenant.imageUrl ? (
                <AvatarImage src={tenant.imageUrl || "/placeholder.svg"} alt={tenant.name} />
              ) : (
                <AvatarFallback>{tenant.name.substring(0, 2)}</AvatarFallback>
              )}
            </Avatar>
            <span>{tenant.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

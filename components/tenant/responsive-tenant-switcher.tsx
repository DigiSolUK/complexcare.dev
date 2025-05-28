"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { TenantSwitcher } from "./tenant-switcher"
import { TenantSwitcherCompact } from "./tenant-switcher-compact"

export function ResponsiveTenantSwitcher() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return isDesktop ? <TenantSwitcher /> : <TenantSwitcherCompact />
}

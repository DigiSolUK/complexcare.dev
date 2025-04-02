"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { MobileNav } from "@/components/layout/mobile-nav"
import { useFeatures } from "@/lib/features-context"

export function MainNav() {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)
  const { isFeatureEnabled } = useFeatures()

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">ComplexCare</span>
      </Link>
      <button className="flex items-center space-x-2 md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
        {showMobileMenu ? <Icons.close className="h-5 w-5" /> : <Icons.logo className="h-5 w-5" />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && <MobileNav />}
      <nav className="hidden gap-6 md:flex">
        <Link
          href="/"
          className={cn(
            "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
            pathname === "/" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Home
        </Link>
        <Link
          href="/features"
          className={cn(
            "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
            pathname?.startsWith("/features") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Features
        </Link>
        <Link
          href="/pricing"
          className={cn(
            "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
            pathname?.startsWith("/pricing") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Pricing
        </Link>
        <Link
          href="/about"
          className={cn(
            "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
            pathname?.startsWith("/about") ? "text-foreground" : "text-foreground/60",
          )}
        >
          About
        </Link>
        <Link
          href="/contact"
          className={cn(
            "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
            pathname?.startsWith("/contact") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Contact
        </Link>
      </nav>
    </div>
  )
}


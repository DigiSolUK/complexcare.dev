"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">ComplexCare CRM</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/patients"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/dashboard/patients") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Patients
        </Link>
        <Link
          href="/dashboard/appointments"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/dashboard/appointments") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Appointments
        </Link>
        <Link
          href="/dashboard/tasks"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/dashboard/tasks") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Tasks
        </Link>
      </nav>
    </div>
  )
}

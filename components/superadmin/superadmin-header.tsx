import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export function SuperadminHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/superadmin" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">ComplexCare</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

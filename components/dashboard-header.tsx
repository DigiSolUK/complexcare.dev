import { UserProfile } from "@/components/user-profile"
import { ModeToggle } from "@/components/mode-toggle"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">ComplexCare CRM</h1>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <UserProfile />
        </div>
      </div>
    </header>
  )
}

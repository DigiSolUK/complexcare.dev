import { MainNav } from "@/components/main-nav"
import { DemoUserMenu } from "@/components/demo-user-menu"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <DemoUserMenu />
          </nav>
        </div>
      </div>
    </header>
  )
}


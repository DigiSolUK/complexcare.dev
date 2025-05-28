import type React from "react"
import { Suspense } from "react"
import { MobileNavigation } from "@/components/mobile/mobile-navigation"

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pb-16">
        <Suspense fallback={<div className="p-4">Loading...</div>}>{children}</Suspense>
      </main>
      <MobileNavigation />
    </div>
  )
}

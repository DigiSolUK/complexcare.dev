import type React from "react"
import { Suspense } from "react"
import { PatientPortalHeader } from "@/components/patient-portal/header"
import { PatientPortalSidebar } from "@/components/patient-portal/sidebar"

export default function PatientPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <PatientPortalSidebar />
      <div className="flex-1 flex flex-col">
        <PatientPortalHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}

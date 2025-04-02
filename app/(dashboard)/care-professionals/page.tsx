import type { Metadata } from "next"
import { CareProfessionalsClient } from "./care-professionals-client"

export const metadata: Metadata = {
  title: "Care Professionals | ComplexCare CRM",
  description: "Manage your care professionals, their credentials, and assignments",
}

export default function CareProfessionalsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Care Professionals</h1>
        <p className="text-muted-foreground">Manage your care professionals, their credentials, and assignments</p>
      </div>

      <CareProfessionalsClient />
    </div>
  )
}


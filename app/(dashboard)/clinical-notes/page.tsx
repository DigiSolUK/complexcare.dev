import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ClinicalNotesClient from "./clinical-notes-client"

export const metadata = {
  title: "Clinical Notes | ComplexCare CRM",
  description: "Manage patient clinical notes and documentation",
}

export default function ClinicalNotesPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Clinical Notes</h1>
      <Suspense fallback={<ClinicalNotesSkeleton />}>
        <ClinicalNotesClient />
      </Suspense>
    </div>
  )
}

function ClinicalNotesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  )
}

import { Suspense } from "react"
import ClinicalNotesClient from "./clinical-notes-client"
import Loading from "./loading"

export const metadata = {
  title: "Clinical Notes | Complex Care CRM",
  description: "Manage patient clinical notes and documentation",
}

export default function ClinicalNotesPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Clinical Notes</h1>
      <Suspense fallback={<Loading />}>
        <ClinicalNotesClient />
      </Suspense>
    </div>
  )
}

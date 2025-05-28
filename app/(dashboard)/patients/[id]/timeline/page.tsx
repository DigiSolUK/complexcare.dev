import { Suspense } from "react"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { PatientTimeline } from "@/components/patients/patient-timeline"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Patient Timeline",
  description: "View comprehensive patient history timeline",
}

export default async function PatientTimelinePage({
  params,
}: {
  params: { id: string }
}) {
  if (!params.id) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader heading="Patient Timeline" subheading="Complete chronological history of patient events" />

      <Suspense fallback={<TimelineSkeleton />}>
        <PatientTimeline patientId={params.id} />
      </Suspense>
    </div>
  )
}

function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

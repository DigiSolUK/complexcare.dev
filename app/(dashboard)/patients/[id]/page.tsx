import { Suspense } from "react"
import { notFound } from "next/navigation"
import { PatientDetailContent } from "./patient-detail-content"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Patient Details",
  description: "View and manage patient details",
}

export default async function PatientDetailPage({
  params,
}: {
  params: { id: string }
}) {
  if (!params.id) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader heading="Patient Details" subheading="View and manage comprehensive patient information" />

      <Suspense fallback={<PatientDetailSkeleton />}>
        <PatientDetailContent patientId={params.id} />
      </Suspense>
    </div>
  )
}

function PatientDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>
    </div>
  )
}

import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCareProfessionalByIdSql } from "@/lib/services/care-professional-service"
import CareProfessionalDetailClient from "./care-professional-detail-client"
import { Skeleton } from "@/components/ui/skeleton"

export default async function CareProfessionalDetailPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    // Use a default tenant ID if not available
    const tenantId = process.env.DEFAULT_TENANT_ID || "default"

    // Fetch the care professional data
    const careProfessional = await getCareProfessionalByIdSql(params.id, tenantId)

    // If no care professional is found, show 404
    if (!careProfessional) {
      return notFound()
    }

    return (
      <Suspense
        fallback={
          <div className="p-4">
            <Skeleton className="h-[500px] w-full" />
          </div>
        }
      >
        <CareProfessionalDetailClient careProfessional={careProfessional} />
      </Suspense>
    )
  } catch (error) {
    console.error("Error in care professional detail page:", error)

    // Return a more user-friendly error
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to load care professional</h2>
        <p className="mb-4">We encountered an issue while trying to load this care professional's details.</p>
        <p className="text-sm text-gray-500">
          Error details: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    )
  }
}

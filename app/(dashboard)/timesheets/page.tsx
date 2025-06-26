import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import TimesheetsContent from "./timesheets-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Timesheets | ComplexCare CRM",
  description: "Manage staff timesheets and working hours",
}

export default function TimesheetsPage() {
  return (
    <Suspense fallback={<TimesheetsSkeleton />}>
      <TimesheetsContent />
    </Suspense>
  )
}

function TimesheetsSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="mt-6">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

export default function ClinicalNotesLoading() {
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Clinical Notes</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-10 w-full sm:w-96" />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-[180px]" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <Skeleton className="h-10 w-[600px]" />

      <div className="grid gap-4 mt-6">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
      </div>
    </div>
  )
}

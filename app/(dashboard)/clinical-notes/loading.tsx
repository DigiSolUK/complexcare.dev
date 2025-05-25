import { Skeleton } from "@/components/ui/skeleton"

export default function ClinicalNotesLoading() {
  return (
    <div className="container mx-auto py-6 px-4">
      <Skeleton className="h-10 w-64 mb-6" />
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
    </div>
  )
}

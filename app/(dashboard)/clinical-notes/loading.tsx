import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Skeleton className="h-[500px] w-full" />
        </div>
        <div className="md:col-span-3">
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    </div>
  )
}

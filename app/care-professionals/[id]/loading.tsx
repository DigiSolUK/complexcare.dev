import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CareProfessionalLoading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="mx-auto max-w-4xl">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Skeleton className="w-24 h-24 rounded-full" />

            <div className="flex-1 space-y-4 w-full">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <div className="grid grid-cols-5 w-full gap-2">
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

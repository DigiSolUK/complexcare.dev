import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AppointmentsLoading() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[350px] mt-2" />
      </div>

      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-[120px] rounded-md" />
              <Skeleton className="h-10 w-[150px] rounded-md" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] flex flex-col gap-4">
            <div className="flex gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-10 flex-1" />
              ))}
            </div>

            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <Skeleton className="h-16 w-[100px]" />
                {Array.from({ length: 7 }).map((_, j) => (
                  <Skeleton key={j} className="h-16 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

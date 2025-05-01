import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function TenantUsersLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" className="mb-4" disabled>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Tenant Details
        </Button>

        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-full max-w-[800px]" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { Suspense } from "react"
import { CareProfessionalsList } from "./care-professionals-list"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

export const metadata = {
  title: "Care Professionals | ComplexCare CRM",
  description: "Manage care professional records and information",
}

function CareProfessionalsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
                    <div>
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CareProfessionalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Care Professionals</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Care Professional
        </Button>
      </div>
      <Suspense fallback={<CareProfessionalsLoading />}>
        <CareProfessionalsList />
      </Suspense>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface PatientDemographicsProps {
  isLoading?: boolean
}

export function PatientDemographics({ isLoading = false }: PatientDemographicsProps) {
  // In a real implementation, this data would come from an API
  const demographicsData = {
    ageGroups: [
      { name: "0-18", count: 42, percentage: 8 },
      { name: "19-35", count: 78, percentage: 15 },
      { name: "36-50", count: 124, percentage: 24 },
      { name: "51-65", count: 156, percentage: 30 },
      { name: "66+", count: 118, percentage: 23 },
    ],
    gender: [
      { name: "Male", count: 238, percentage: 46 },
      { name: "Female", count: 276, percentage: 53 },
      { name: "Other", count: 4, percentage: 1 },
    ],
    careCategories: [
      { name: "Complex Care", count: 187, percentage: 36 },
      { name: "Palliative", count: 98, percentage: 19 },
      { name: "Rehabilitation", count: 124, percentage: 24 },
      { name: "Mental Health", count: 67, percentage: 13 },
      { name: "Other", count: 42, percentage: 8 },
    ],
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[180px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[250px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Demographics</CardTitle>
        <CardDescription>Patient population breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-sm font-medium">Age Distribution</h4>
            <div className="space-y-2">
              {demographicsData.ageGroups.map((group) => (
                <div key={group.name} className="flex items-center">
                  <div className="w-12 text-xs">{group.name}</div>
                  <div className="flex-1 px-2">
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${group.percentage}%` }} />
                    </div>
                  </div>
                  <div className="w-12 text-right text-xs">{group.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="mb-3 text-sm font-medium">Gender</h4>
              <div className="space-y-2">
                {demographicsData.gender.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-xs">{item.name}</span>
                    <span className="text-xs font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium">Care Categories</h4>
              <div className="space-y-2">
                {demographicsData.careCategories.slice(0, 3).map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-xs">{item.name}</span>
                    <span className="text-xs font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

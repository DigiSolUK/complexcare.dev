"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

interface DemographicsData {
  ageGroups: {
    label: string
    value: number
    percentage: number
  }[]
  genderDistribution: {
    label: string
    value: number
    percentage: number
  }[]
  careCategories: {
    label: string
    value: number
    percentage: number
  }[]
}

interface PatientDemographicsProps {
  data?: DemographicsData
  isLoading?: boolean
}

export function PatientDemographics({ data, isLoading = false }: PatientDemographicsProps) {
  // Default data for when real data isn't available
  const defaultData: DemographicsData = {
    ageGroups: [
      { label: "0-17", value: 12, percentage: 5 },
      { label: "18-34", value: 28, percentage: 11 },
      { label: "35-50", value: 45, percentage: 18 },
      { label: "51-65", value: 67, percentage: 27 },
      { label: "66-80", value: 58, percentage: 23 },
      { label: "81+", value: 38, percentage: 16 },
    ],
    genderDistribution: [
      { label: "Male", value: 118, percentage: 48 },
      { label: "Female", value: 124, percentage: 50 },
      { label: "Other", value: 6, percentage: 2 },
    ],
    careCategories: [
      { label: "Complex Needs", value: 87, percentage: 35 },
      { label: "Elderly Care", value: 62, percentage: 25 },
      { label: "Mental Health", value: 45, percentage: 18 },
      { label: "Physical Disability", value: 32, percentage: 13 },
      { label: "Learning Disability", value: 22, percentage: 9 },
    ],
  }

  const demographics = data || defaultData

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
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <div className="space-y-2">
                  {[...Array(i === 0 ? 6 : i === 1 ? 3 : 5)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[50px]" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Demographics</CardTitle>
        <CardDescription>Distribution of patient population</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Age Distribution</h4>
            <div className="space-y-2">
              {demographics.ageGroups.map((group) => (
                <div key={group.label} className="flex items-center gap-2">
                  <div className="w-12 text-xs">{group.label}</div>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${group.percentage}%` }}></div>
                    </div>
                  </div>
                  <div className="w-12 text-xs text-right">{group.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Gender Distribution</h4>
            <div className="space-y-2">
              {demographics.genderDistribution.map((gender) => (
                <div key={gender.label} className="flex items-center gap-2">
                  <div className="w-12 text-xs">{gender.label}</div>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-purple-500" style={{ width: `${gender.percentage}%` }}></div>
                    </div>
                  </div>
                  <div className="w-12 text-xs text-right">{gender.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Care Categories</h4>
            <div className="space-y-2">
              {demographics.careCategories.map((category) => (
                <div key={category.label} className="flex items-center gap-2">
                  <div className="w-32 text-xs">{category.label}</div>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: `${category.percentage}%` }}></div>
                    </div>
                  </div>
                  <div className="w-12 text-xs text-right">{category.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          {!data && (
            <Alert variant="outline" className="mt-4">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>Showing demo data. Connect to patient API for real demographics.</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

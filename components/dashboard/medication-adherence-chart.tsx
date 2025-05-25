"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

interface MedicationAdherenceChartProps {
  isLoading?: boolean
}

export function MedicationAdherenceChart({ isLoading = false }: MedicationAdherenceChartProps) {
  // In a real implementation, this data would come from an API
  const adherenceData = {
    overall: 86,
    byCategory: [
      { name: "Cardiovascular", adherence: 92, color: "bg-red-500" },
      { name: "Respiratory", adherence: 88, color: "bg-blue-500" },
      { name: "Pain Management", adherence: 78, color: "bg-green-500" },
      { name: "Neurological", adherence: 85, color: "bg-purple-500" },
      { name: "Other", adherence: 90, color: "bg-yellow-500" },
    ],
    missedDoses: 24,
    onTimeAdministration: 94,
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
        <CardTitle>Medication Adherence</CardTitle>
        <CardDescription>Medication compliance by category</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Adherence</span>
            <span className="text-sm font-medium">{adherenceData.overall}%</span>
          </div>
          <Progress value={adherenceData.overall} className="h-2" />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">By Medication Category</h4>
          {adherenceData.byCategory.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">{category.name}</span>
                <span className="text-sm">{category.adherence}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div className={`h-2 rounded-full ${category.color}`} style={{ width: `${category.adherence}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">Missed Doses</div>
            <div className="mt-1 text-2xl font-bold">{adherenceData.missedDoses}</div>
            <div className="text-xs text-muted-foreground">Last 7 days</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">On-time Administration</div>
            <div className="mt-1 text-2xl font-bold">{adherenceData.onTimeAdministration}%</div>
            <div className="text-xs text-muted-foreground">Last 7 days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

interface MedicationAdherenceData {
  adherenceRate: number
  missedDoses: number
  onTimeRate: number
  totalPatients: number
  byCategory: {
    category: string
    adherenceRate: number
    patientCount: number
  }[]
}

interface MedicationAdherenceChartProps {
  data?: MedicationAdherenceData
  isLoading?: boolean
}

export function MedicationAdherenceChart({ data, isLoading = false }: MedicationAdherenceChartProps) {
  // Default data for when real data isn't available
  const defaultData: MedicationAdherenceData = {
    adherenceRate: 84,
    missedDoses: 37,
    onTimeRate: 91,
    totalPatients: 156,
    byCategory: [
      { category: "Cardiovascular", adherenceRate: 88, patientCount: 42 },
      { category: "Respiratory", adherenceRate: 82, patientCount: 28 },
      { category: "Neurological", adherenceRate: 79, patientCount: 35 },
      { category: "Pain Management", adherenceRate: 86, patientCount: 51 },
    ],
  }

  const adherenceData = data || defaultData

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[220px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[250px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication Adherence</CardTitle>
        <CardDescription>Patient medication compliance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-muted">
              <div
                className="absolute inset-0 rounded-full border-8"
                style={{
                  clipPath: `inset(0 ${100 - adherenceData.adherenceRate}% 0 0)`,
                  borderColor: getAdherenceColor(adherenceData.adherenceRate),
                }}
              ></div>
              <div className="text-center">
                <div className="text-3xl font-bold">{adherenceData.adherenceRate}%</div>
                <div className="text-xs text-muted-foreground">Overall Adherence</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold">{adherenceData.totalPatients}</div>
                <div className="text-xs text-muted-foreground">Patients</div>
              </div>
              <div>
                <div className="text-xl font-bold">{adherenceData.missedDoses}</div>
                <div className="text-xs text-muted-foreground">Missed Doses</div>
              </div>
              <div>
                <div className="text-xl font-bold">{adherenceData.onTimeRate}%</div>
                <div className="text-xs text-muted-foreground">On-Time Rate</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Adherence by Medication Category</h4>
            {adherenceData.byCategory.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {category.category} <span className="text-xs text-muted-foreground">({category.patientCount})</span>
                  </span>
                  <span
                    className={`text-sm font-medium ${getAdherenceColor(category.adherenceRate)}`}
                  >{`${category.adherenceRate}%`}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${category.adherenceRate}%`,
                      backgroundColor: getAdherenceColorHex(category.adherenceRate),
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {!data && (
            <Alert variant="outline" className="mt-4">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>Showing demo data. Connect to medication API for real metrics.</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function getAdherenceColor(value: number): string {
  if (value >= 90) return "text-green-600"
  if (value >= 80) return "text-blue-600"
  if (value >= 70) return "text-amber-600"
  return "text-red-600"
}

function getAdherenceColorHex(value: number): string {
  if (value >= 90) return "#16a34a" // green-600
  if (value >= 80) return "#2563eb" // blue-600
  if (value >= 70) return "#d97706" // amber-600
  return "#dc2626" // red-600
}

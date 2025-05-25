"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, Plus, TrendingUp, TrendingDown } from "lucide-react"

interface Vital {
  id: string
  type: string
  value: string
  unit: string
  recorded_date: string
  recorded_by_name?: string
  is_normal: boolean
}

interface PatientVitalsSummaryProps {
  patientId: string
}

function PatientVitalsSummary({ patientId }: PatientVitalsSummaryProps) {
  const [vitals, setVitals] = useState<Vital[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVitals = async () => {
      if (!patientId) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/patients/${patientId}/vitals?limit=4`)
        if (response.ok) {
          const data = await response.json()
          setVitals(data)
        }
      } catch (error) {
        console.error("Error fetching vitals:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVitals()
  }, [patientId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vital Signs</CardTitle>
          <CardDescription>Latest vital sign measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Vital Signs</CardTitle>
          <CardDescription>Latest vital sign measurements</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Record
        </Button>
      </CardHeader>
      <CardContent>
        {vitals.length === 0 ? (
          <div className="text-center py-6">
            <Heart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No vital signs recorded</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {vitals.map((vital) => (
              <div key={vital.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{vital.type}</h4>
                  {vital.is_normal ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                </div>
                <p className="text-lg font-semibold">
                  {vital.value} {vital.unit}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(vital.recorded_date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Vitals
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PatientVitalsSummary

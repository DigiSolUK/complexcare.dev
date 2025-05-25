"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ActivityData {
  date: string
  visits: number
  notes: number
  medications: number
  assessments: number
}

export function PatientActivityChart() {
  const [data, setData] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemoData, setIsDemoData] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // In a real implementation, this would fetch from an API
        const response = await fetch("/api/dashboard/patient-activity")

        if (!response.ok) {
          // If the API fails, use demo data
          setIsDemoData(true)
          setData(generateDemoData())
          return
        }

        const result = await response.json()
        setData(result.data)
      } catch (err) {
        console.error("Error fetching patient activity data:", err)
        setIsDemoData(true)
        setData(generateDemoData())
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Patient Activity</CardTitle>
          <CardDescription>Overview of patient interactions this week</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Patient Activity</CardTitle>
          <CardDescription>Overview of patient interactions this week</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>Patient Activity</CardTitle>
        <CardDescription>Overview of patient interactions this week</CardDescription>
      </CardHeader>
      <CardContent>
        {isDemoData && (
          <Alert className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>Showing demo data. Connect to the activity logs API for real data.</AlertDescription>
          </Alert>
        )}
        <div className="h-[300px]">
          {/* This would be a chart component in a real implementation */}
          <div className="flex h-full items-end gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col-reverse gap-1">
                  <div
                    className="bg-blue-500 rounded-t w-full"
                    style={{ height: `${(item.visits / 10) * 100}px` }}
                    title={`Visits: ${item.visits}`}
                  />
                  <div
                    className="bg-green-500 rounded-t w-full"
                    style={{ height: `${(item.notes / 10) * 100}px` }}
                    title={`Notes: ${item.notes}`}
                  />
                  <div
                    className="bg-purple-500 rounded-t w-full"
                    style={{ height: `${(item.medications / 10) * 100}px` }}
                    title={`Medications: ${item.medications}`}
                  />
                  <div
                    className="bg-orange-500 rounded-t w-full"
                    style={{ height: `${(item.assessments / 10) * 100}px` }}
                    title={`Assessments: ${item.assessments}`}
                  />
                </div>
                <span className="text-xs mt-2">{formatDate(item.date)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
              <span className="text-xs">Visits</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2" />
              <span className="text-xs">Notes</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded mr-2" />
              <span className="text-xs">Medications</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded mr-2" />
              <span className="text-xs">Assessments</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function generateDemoData(): ActivityData[] {
  const days = 7
  const result: ActivityData[] = []

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))

    result.push({
      date: date.toISOString(),
      visits: Math.floor(Math.random() * 8) + 1,
      notes: Math.floor(Math.random() * 6) + 2,
      medications: Math.floor(Math.random() * 5) + 1,
      assessments: Math.floor(Math.random() * 4) + 1,
    })
  }

  return result
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-GB", { weekday: "short" })
}

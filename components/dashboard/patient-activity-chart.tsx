"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getPatientActivityData } from "@/lib/actions/dashboard-actions"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ActivityData {
  date: string
  visits: number
  assessments: number
  medications: number
}

export function PatientActivityChart() {
  const [data, setData] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const activityData = await getPatientActivityData()
        setData(activityData)
      } catch (err) {
        console.error("Failed to fetch patient activity data:", err)
        setError("Failed to load patient activity data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  }

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  if (error) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-sm text-blue-500 hover:text-blue-700">
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={formatDate} />
        <YAxis />
        <Tooltip formatter={(value: number) => [value, ""]} labelFormatter={(label) => formatDate(label)} />
        <Legend />
        <Line type="monotone" dataKey="visits" stroke="#8884d8" activeDot={{ r: 8 }} name="Visits" />
        <Line type="monotone" dataKey="assessments" stroke="#82ca9d" name="Assessments" />
        <Line type="monotone" dataKey="medications" stroke="#ffc658" name="Medications" />
      </LineChart>
    </ResponsiveContainer>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ClipboardList, Plus, Target } from "lucide-react"
import { format, parseISO } from "date-fns"

interface CarePlan {
  id: string
  title: string
  status: string
  start_date: string
  end_date?: string
  goals_count?: number
  progress_percentage?: number
  created_by_name?: string
}

interface PatientCarePlansSummaryProps {
  patientId: string
}

function PatientCarePlansSummary({ patientId }: PatientCarePlansSummaryProps) {
  const [carePlans, setCarePlans] = useState<CarePlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCarePlans = async () => {
      if (!patientId) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/patients/${patientId}/care-plans?limit=3`)
        if (response.ok) {
          const data = await response.json()
          setCarePlans(data)
        }
      } catch (error) {
        console.error("Error fetching care plans:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCarePlans()
  }, [patientId])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Care Plans</CardTitle>
          <CardDescription>Active treatment and care plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
          <CardTitle>Care Plans</CardTitle>
          <CardDescription>Active treatment and care plans</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Create Plan
        </Button>
      </CardHeader>
      <CardContent>
        {carePlans.length === 0 ? (
          <div className="text-center py-6">
            <ClipboardList className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No care plans created</p>
          </div>
        ) : (
          <div className="space-y-4">
            {carePlans.map((plan) => (
              <div key={plan.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{plan.title}</h4>
                    {plan.goals_count && <Target className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Started {format(parseISO(plan.start_date), "PPP")}
                  {plan.end_date && ` - Ends ${format(parseISO(plan.end_date), "PPP")}`}
                </p>
                {plan.progress_percentage !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${plan.progress_percentage}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{plan.progress_percentage}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Care Plans
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PatientCarePlansSummary

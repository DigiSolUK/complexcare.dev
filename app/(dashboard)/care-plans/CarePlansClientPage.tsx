"use client"

import { useState, useEffect, useCallback } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CarePlanTable } from "@/components/care-plans/care-plan-table"
import { CreateCarePlanDialog } from "@/components/care-plans/create-care-plan-dialog"
import { DemoBanner } from "@/components/demo-banner"
import type { CarePlan } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function CarePlansClientPage() {
  const { toast } = useToast()
  const [carePlans, setCarePlans] = useState<CarePlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchCarePlans = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/care-plans")
      if (!response.ok) {
        throw new Error("Failed to fetch care plans")
      }
      const data: CarePlan[] = await response.json()
      setCarePlans(data)
    } catch (err: any) {
      setError(err.message || "An unknown error occurred")
      toast({
        title: "Error",
        description: `Failed to load care plans: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchCarePlans()
  }, [fetchCarePlans])

  const filteredCarePlans = carePlans.filter(
    (plan) =>
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.assigned_to_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <DemoBanner />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Care Plans</h1>
          <p className="text-muted-foreground">Create and manage personalized care plans for your patients</p>
        </div>
        <CreateCarePlanDialog onSuccess={fetchCarePlans} />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Care Plans</CardTitle>
            <CardDescription>View and manage all active care plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Input
                placeholder="Search care plans by title, patient, or staff..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* <Button variant="outline">Filter</Button> */}
            </div>
            {loading ? (
              <div className="text-center py-8">Loading care plans...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
              <CarePlanTable initialCarePlans={filteredCarePlans} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

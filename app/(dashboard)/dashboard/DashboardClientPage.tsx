"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SimpleDashboard } from "@/components/dashboard/simple-dashboard"
import { EnhancedDashboard } from "@/components/dashboard/enhanced-dashboard"
import { DashboardProvider, useDashboard } from "@/components/dashboard/dashboard-context"
import { DashboardFilters, type FilterOption } from "@/components/dashboard/dashboard-filters"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

// Filter options for the dashboard
const filterOptions: FilterOption[] = [
  {
    id: "patientStatus",
    label: "Patient Status",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "critical", label: "Critical" },
      { value: "stable", label: "Stable" },
    ],
  },
  {
    id: "appointmentType",
    label: "Appointment Type",
    options: [
      { value: "checkup", label: "Check-up" },
      { value: "followup", label: "Follow-up" },
      { value: "emergency", label: "Emergency" },
      { value: "consultation", label: "Consultation" },
      { value: "therapy", label: "Therapy" },
    ],
  },
  {
    id: "taskPriority",
    label: "Task Priority",
    options: [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
  },
]

function DashboardContent() {
  const { filters, setFilters, isLoading, refreshData } = useDashboard()
  const [dashboardView, setDashboardView] = useState<"simple" | "enhanced">("enhanced")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <Tabs
          defaultValue="enhanced"
          value={dashboardView}
          onValueChange={(value) => setDashboardView(value as "simple" | "enhanced")}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="simple">Simple</TabsTrigger>
            <TabsTrigger value="enhanced">Enhanced</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="sm" onClick={() => refreshData()} disabled={isLoading} className="ml-auto">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Filters</CardTitle>
          <CardDescription>Filter dashboard data by date range and other criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardFilters filterOptions={filterOptions} filters={filters} onChange={setFilters} />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[120px]" />
            ))}
          </div>
        </div>
      ) : (
        <TabsContent value={dashboardView} forceMount={true} hidden={dashboardView !== "simple"}>
          <SimpleDashboard />
        </TabsContent>
      )}

      {!isLoading && (
        <TabsContent value={dashboardView} forceMount={true} hidden={dashboardView !== "enhanced"}>
          <EnhancedDashboard />
        </TabsContent>
      )}
    </div>
  )
}

export default function DashboardClientPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  )
}

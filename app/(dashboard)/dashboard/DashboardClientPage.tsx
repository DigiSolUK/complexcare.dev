"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataFetchErrorBoundary } from "@/components/error-boundaries"
import { DashboardProvider } from "@/components/dashboard/dashboard-context"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { EnhancedDashboard } from "@/components/dashboard/enhanced-dashboard"
import { SimpleDashboard } from "@/components/dashboard/simple-dashboard"

export function DashboardClientPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <DashboardProvider>
      <div className="space-y-4">
        <DashboardFilters />

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>

          <DataFetchErrorBoundary>
            <TabsContent value="overview" className="space-y-4">
              <EnhancedDashboard />
            </TabsContent>

            <TabsContent value="patients" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Metrics</CardTitle>
                  <CardDescription>Key patient statistics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleDashboard type="patients" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Performance</CardTitle>
                  <CardDescription>Care professional metrics and productivity</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleDashboard type="staff" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="finance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>Revenue, expenses and financial health</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleDashboard type="finance" />
                </CardContent>
              </Card>
            </TabsContent>
          </DataFetchErrorBoundary>
        </Tabs>
      </div>
    </DashboardProvider>
  )
}

import type { Metadata } from "next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CarePlanTable } from "@/components/care-plans/care-plan-table"
import { CreateCarePlanDialog } from "@/components/care-plans/create-care-plan-dialog"
import { DemoBanner } from "@/components/demo-banner"

export const metadata: Metadata = {
  title: "Care Plans | ComplexCare CRM",
  description: "Manage patient care plans in the ComplexCare CRM system",
}

export default function CarePlansPage() {
  return (
    <div className="flex flex-col gap-6">
      <DemoBanner />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Care Plans</h1>
          <p className="text-muted-foreground">Create and manage personalized care plans for your patients</p>
        </div>
        <CreateCarePlanDialog />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Care Plans</CardTitle>
            <CardDescription>View and manage all active care plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Input placeholder="Search care plans..." className="max-w-sm" />
              <Button variant="outline">Filter</Button>
            </div>
            <CarePlanTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


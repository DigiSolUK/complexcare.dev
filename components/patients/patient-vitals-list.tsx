"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Activity } from "lucide-react"

interface PatientVitalsListProps {
  patientId: string
}

export default function PatientVitalsList({ patientId }: PatientVitalsListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vitals</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Record Vitals
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Vitals</h3>
          <p className="text-muted-foreground mb-4">This feature is coming soon.</p>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, HeartPulse } from "lucide-react"

interface PatientAssessmentsListProps {
  patientId: string
}

export default function PatientAssessmentsList({ patientId }: PatientAssessmentsListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Assessments</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <HeartPulse className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Assessments</h3>
          <p className="text-muted-foreground mb-4">This feature is coming soon.</p>
        </div>
      </CardContent>
    </Card>
  )
}

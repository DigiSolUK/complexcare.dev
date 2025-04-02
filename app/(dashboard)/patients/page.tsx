import type { Metadata } from "next"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DemoPatientTable } from "@/components/patients/demo-patient-table"

export const metadata: Metadata = {
  title: "Patients",
  description: "Manage your patients",
}

export default function PatientsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">Manage your patients and their care plans</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Directory</CardTitle>
          <CardDescription>View and manage all your patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Input placeholder="Search patients..." className="max-w-sm" />
            <Button variant="outline">Filter</Button>
          </div>
          <DemoPatientTable />
        </CardContent>
      </Card>
    </div>
  )
}


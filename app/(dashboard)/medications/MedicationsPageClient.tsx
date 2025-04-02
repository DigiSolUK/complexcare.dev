"use client"

import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MedicationTable } from "@/components/medications/medication-table"
import { MedicationForm } from "@/components/medications/medication-form"

export default function MedicationsPageClient() {
  const samplePatients = [
    { id: "P001", name: "John Doe" },
    { id: "P002", name: "Jane Smith" },
    { id: "P003", name: "Robert Johnson" },
    { id: "P004", name: "Emily Williams" },
    { id: "P005", name: "Michael Brown" },
  ]

  const sampleCareProfessionals = [
    { id: "CP001", name: "Dr. Sarah Johnson" },
    { id: "CP002", name: "Dr. Michael Chen" },
    { id: "CP003", name: "Dr. Emily Williams" },
    { id: "CP004", name: "Dr. James Wilson" },
    { id: "CP005", name: "Nurse Lisa Thompson" },
  ]

  const handleSubmit = (data: any) => {
    console.log("Form submitted:", data)
    // In a real application, this would save the data to the database
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medications</h1>
          <p className="text-muted-foreground">Manage patient medications and prescriptions</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medication Management</CardTitle>
          <CardDescription>View and manage all patient medications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Input placeholder="Search medications..." className="max-w-sm" />
            <Button variant="outline">Filter</Button>
          </div>
          <MedicationTable />
        </CardContent>
      </Card>
      <div className="hidden">
        <MedicationForm onSubmit={handleSubmit} patients={samplePatients} careProfessionals={sampleCareProfessionals} />
      </div>
    </div>
  )
}


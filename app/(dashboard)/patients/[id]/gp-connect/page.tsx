/**
 * GP Connect Patient Records Page
 *
 * This page displays patient records from GP Connect for a specific patient.
 * It uses the PatientRecordsViewer component to render the data.
 *
 * References:
 * - GP Connect Demonstrator: https://gpconnect.github.io/gpconnect-demonstrator/
 * - GP Connect Specifications: https://developer.nhs.uk/apis/gpconnect-1-6-0/
 */

import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PatientRecordsViewer } from "@/components/patients/patient-records-viewer"

// Demo data for patients
const demoPatients = [
  {
    id: "P001",
    name: "John Smith",
    nhsNumber: "9000000009",
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    nhsNumber: "9000000017",
  },
  {
    id: "P003",
    name: "David Taylor",
    nhsNumber: "9000000025",
  },
]

export default function PatientGPConnectPage({ params }: { params: { id: string } }) {
  const patient = demoPatients.find((p) => p.id === params.id)

  if (!patient) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/patients/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{patient.name} - GP Connect Records</h1>
          <p className="text-muted-foreground">NHS Number: {patient.nhsNumber}</p>
        </div>
      </div>

      <PatientRecordsViewer nhsNumber={patient.nhsNumber} />
    </div>
  )
}


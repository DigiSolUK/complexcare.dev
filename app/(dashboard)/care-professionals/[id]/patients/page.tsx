import type { Metadata } from "next"
import { PatientAssignmentList } from "@/components/care-professionals/patient-assignment-list"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Assigned Patients | ComplexCare CRM",
  description: "View and manage patients assigned to this care professional",
}

export default function CareProfessionalPatientsPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" asChild>
            <Link href={`/care-professionals/${params.id}`}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Professional
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">Assigned Patients</h1>
        </div>
      </div>

      <PatientAssignmentList careProfessionalId={params.id} includeEnded={true} allowAdd={true} allowRemove={true} />
    </div>
  )
}

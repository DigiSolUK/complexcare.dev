/**
 * Patient GP Connect Link Component
 *
 * This component provides a link to the GP Connect records for a patient.
 * It's designed to be embedded in the patient detail page.
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface PatientGPConnectLinkProps {
  patientId: string
}

export function PatientGPConnectLink({ patientId }: PatientGPConnectLinkProps) {
  return (
    <Button asChild variant="outline" className="w-full">
      <Link href={`/patients/${patientId}/gp-connect`} className="flex items-center justify-center gap-2">
        <FileText className="h-4 w-4" />
        View GP Connect Records
      </Link>
    </Button>
  )
}


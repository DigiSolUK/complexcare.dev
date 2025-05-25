"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import type { ClinicalNote } from "@/lib/services/clinical-notes-service"

interface ClinicalNotePrintViewProps {
  note: ClinicalNote
  patientName?: string
  tenantName?: string
}

export default function ClinicalNotePrintView({ note, patientName, tenantName }: ClinicalNotePrintViewProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <div className="mb-4 print:hidden">
        <Button onClick={handlePrint} variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Print Note
        </Button>
      </div>

      <div className="clinical-note-print bg-white p-8">
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .clinical-note-print,
            .clinical-note-print * {
              visibility: visible;
            }
            .clinical-note-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}</style>

        <div className="mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold">{tenantName || "Healthcare Provider"}</h1>
          <p className="text-sm text-muted-foreground">Clinical Note</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Patient:</p>
            <p>{patientName || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Date:</p>
            <p>{format(new Date(note.created_at), "PPP")}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Category:</p>
            <p>{note.category?.name || "General"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Care Professional:</p>
            <p>
              {note.care_professional
                ? `${note.care_professional.first_name} ${note.care_professional.last_name}`
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">{note.title}</h2>
          {note.is_confidential && <p className="mb-2 text-sm font-medium text-red-600">CONFIDENTIAL</p>}
        </div>

        <div className="whitespace-pre-wrap">{note.content}</div>

        {note.tags && note.tags.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium">Tags:</p>
            <p className="text-sm">{note.tags.join(", ")}</p>
          </div>
        )}

        <div className="mt-8 border-t pt-4 text-xs text-muted-foreground">
          <p>
            Created by: {note.created_by} on {format(new Date(note.created_at), "PPpp")}
          </p>
          {note.updated_at !== note.created_at && <p>Last updated: {format(new Date(note.updated_at), "PPpp")}</p>}
        </div>
      </div>
    </>
  )
}

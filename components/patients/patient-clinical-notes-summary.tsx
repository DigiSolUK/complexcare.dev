"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Plus, AlertTriangle } from "lucide-react"
import { format, parseISO } from "date-fns"
import type { ClinicalNote } from "@/lib/services/clinical-notes-service"
import { CreateClinicalNoteDialog } from "@/components/clinical-notes/create-clinical-note-dialog"

interface PatientClinicalNotesSummaryProps {
  patientId: string
}

function PatientClinicalNotesSummary({ patientId }: PatientClinicalNotesSummaryProps) {
  const router = useRouter()
  const [notes, setNotes] = useState<ClinicalNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    const fetchNotes = async () => {
      if (!patientId) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/patients/${patientId}/clinical-notes?limit=3`)
        if (response.ok) {
          const data = await response.json()
          setNotes(data)
        } else {
          console.error("Failed to fetch clinical notes:", await response.json())
        }
      } catch (error) {
        console.error("Error fetching clinical notes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [patientId])

  const handleCreateNote = () => {
    setIsCreateDialogOpen(true)
  }

  const handleViewAllNotes = () => {
    router.push(`/patients/${patientId}/clinical-notes`)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clinical Notes</CardTitle>
          <CardDescription>Recent clinical documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Clinical Notes</CardTitle>
          <CardDescription>Recent clinical documentation</CardDescription>
        </div>
        <Button size="sm" onClick={handleCreateNote}>
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </Button>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <div className="text-center py-6">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No clinical notes yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{note.title}</h4>
                    {note.is_important && <AlertTriangle className="h-3 w-3 text-red-500" />}
                  </div>
                  {note.category_name && (
                    <Badge className="text-xs" style={{ backgroundColor: note.category_color || undefined }}>
                      {note.category_name}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {format(parseISO(note.created_at), "PPP")} by {note.created_by_name || "Unknown"}
                </p>
                <p className="text-sm line-clamp-1">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleViewAllNotes}>
          View All Notes
        </Button>
      </CardFooter>

      <CreateClinicalNoteDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        patientId={patientId}
        onSuccess={() => {
          // Refresh notes
          fetch(`/api/patients/${patientId}/clinical-notes?limit=3`)
            .then((res) => res.json())
            .then(setNotes)
            .catch(console.error)
        }}
      />
    </Card>
  )
}

export default PatientClinicalNotesSummary

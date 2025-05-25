"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Edit, Trash2, AlertTriangle, Calendar, Tag } from "lucide-react"
import { format, parseISO } from "date-fns"
import type { ClinicalNote } from "@/lib/services/clinical-notes-service"
import { ViewClinicalNoteDialog } from "@/components/clinical-notes/view-clinical-note-dialog"
import { EditClinicalNoteDialog } from "@/components/clinical-notes/edit-clinical-note-dialog"

interface ClinicalNotesListProps {
  patientId: string
}

export function ClinicalNotesList({ patientId }: ClinicalNotesListProps) {
  const router = useRouter()
  const [notes, setNotes] = useState<ClinicalNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    const fetchNotes = async () => {
      if (!patientId) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/patients/${patientId}/clinical-notes`)
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

  const handleViewNote = (note: ClinicalNote) => {
    setSelectedNote(note)
    setIsViewDialogOpen(true)
  }

  const handleEditNote = (note: ClinicalNote) => {
    setSelectedNote(note)
    setIsEditDialogOpen(true)
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return
    }

    try {
      const response = await fetch(`/api/clinical-notes/${noteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== noteId))
      } else {
        console.error("Failed to delete clinical note:", await response.json())
      }
    } catch (error) {
      console.error("Error deleting clinical note:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Clinical Notes</h3>
        <p className="text-muted-foreground mb-4">There are no clinical notes for this patient yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id} className={note.is_important ? "border-red-300" : undefined}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{note.title}</CardTitle>
                {note.is_important && <AlertTriangle className="h-4 w-4 text-red-500" />}
                {note.is_private && (
                  <Badge variant="outline" className="text-xs">
                    Private
                  </Badge>
                )}
              </div>
              {note.category_name && (
                <Badge style={{ backgroundColor: note.category_color || undefined }}>{note.category_name}</Badge>
              )}
            </div>
            <CardDescription>
              {format(parseISO(note.created_at), "PPP")} by {note.created_by_name || "Unknown"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-sm line-clamp-2">
              {note.content.substring(0, 200)}
              {note.content.length > 200 && "..."}
            </div>
            {note.follow_up_date && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Follow-up: {format(parseISO(note.follow_up_date), "PPP")}</span>
              </div>
            )}
            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Tag className="h-3 w-3" />
                <span>{note.tags.join(", ")}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewNote(note)}>
              View
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEditNote(note)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteNote(note.id)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}

      {selectedNote && (
        <>
          <ViewClinicalNoteDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} note={selectedNote} />
          <EditClinicalNoteDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            note={selectedNote}
            onSuccess={() => {
              // Refresh notes
              fetch(`/api/patients/${patientId}/clinical-notes`)
                .then((res) => res.json())
                .then(setNotes)
                .catch(console.error)
            }}
          />
        </>
      )}
    </div>
  )
}

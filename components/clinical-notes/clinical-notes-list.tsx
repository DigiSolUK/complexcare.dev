"use client"

import { useState } from "react"
import type { ClinicalNote } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Edit, Eye, Trash } from "lucide-react"
import { ViewClinicalNoteDialog } from "./view-clinical-note-dialog"
import { EditClinicalNoteDialog } from "./edit-clinical-note-dialog"
import { DeleteConfirmationDialog } from "@/components/data-management/delete-confirmation-dialog"
import { deleteClinicalNote } from "@/lib/actions/clinical-notes-actions"
import { useToast } from "@/components/ui/use-toast"

export function ClinicalNotesList({
  // Changed to named export
  notes,
  onNoteUpdated,
  onNoteDeleted,
}: { notes: ClinicalNote[]; onNoteUpdated: () => void; onNoteDeleted: () => void }) {
  const [viewNote, setViewNote] = useState<ClinicalNote | null>(null)
  const [editNote, setEditNote] = useState<ClinicalNote | null>(null)
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (deleteNoteId) {
      try {
        const result = await deleteClinicalNote(deleteNoteId)
        if (result.success) {
          toast({
            title: "Success",
            description: "Clinical note deleted successfully.",
          })
          onNoteDeleted()
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete clinical note.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting clinical note:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
      } finally {
        setDeleteNoteId(null)
      }
    }
  }

  if (notes.length === 0) {
    return <p className="text-center text-muted-foreground">No clinical notes found for this patient.</p>
  }

  return (
    <div className="grid gap-4">
      {notes.map((note) => (
        <Card key={note.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">{note.title}</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setViewNote(note)}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View note</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setEditNote(note)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit note</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteNoteId(note.id)}>
                <Trash className="h-4 w-4 text-red-500" />
                <span className="sr-only">Delete note</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
            <p className="text-xs text-muted-foreground mt-2">Created: {format(new Date(note.created_at), "PPP")}</p>
            {note.updated_at && note.updated_at !== note.created_at && (
              <p className="text-xs text-muted-foreground">Last Updated: {format(new Date(note.updated_at), "PPP")}</p>
            )}
          </CardContent>
        </Card>
      ))}

      {viewNote && <ViewClinicalNoteDialog open={!!viewNote} onOpenChange={() => setViewNote(null)} note={viewNote} />}

      {editNote && (
        <EditClinicalNoteDialog
          open={!!editNote}
          onOpenChange={() => setEditNote(null)}
          note={editNote}
          onNoteUpdated={() => {
            onNoteUpdated()
            setEditNote(null) // Close dialog after update
          }}
        />
      )}

      {deleteNoteId && (
        <DeleteConfirmationDialog
          open={!!deleteNoteId}
          onOpenChange={() => setDeleteNoteId(null)}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          description="Are you sure you want to delete this clinical note? This action cannot be undone."
        />
      )}
    </div>
  )
}

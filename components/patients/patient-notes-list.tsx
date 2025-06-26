"use client"

import { DialogDescription } from "@/components/ui/dialog"

import { useState } from "react"
import { format } from "date-fns"
import type { PatientNote } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, User } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface PatientNotesListProps {
  notes: PatientNote[]
  onNoteUpdated: () => void
  onNoteDeleted: () => void
}

export function PatientNotesList({ notes, onNoteUpdated, onNoteDeleted }: PatientNotesListProps) {
  const { toast } = useToast()
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<PatientNote | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [editedNoteType, setEditedNoteType] = useState("")
  const [editedIsPrivate, setEditedIsPrivate] = useState(false)

  const handleDeleteClick = (noteId: string) => {
    setNoteToDelete(noteId)
    setIsConfirmDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return
    try {
      const response = await fetch(`/api/patient-notes/${noteToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete note")
      }

      toast({
        title: "Success",
        description: "Note deleted successfully.",
      })
      onNoteDeleted()
    } catch (error: any) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: `Failed to delete note: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsConfirmDeleteDialogOpen(false)
      setNoteToDelete(null)
    }
  }

  const handleEditClick = (note: PatientNote) => {
    setEditingNote(note)
    setEditedContent(note.content)
    setEditedNoteType(note.note_type)
    setEditedIsPrivate(note.is_private)
    setIsEditDialogOpen(true)
  }

  const handleUpdateNote = async () => {
    if (!editingNote) return
    try {
      const response = await fetch(`/api/patient-notes/${editingNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
          note_type: editedNoteType,
          is_private: editedIsPrivate,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update note")
      }

      toast({
        title: "Success",
        description: "Note updated successfully.",
      })
      onNoteUpdated()
      setIsEditDialogOpen(false)
      setEditingNote(null)
    } catch (error: any) {
      console.error("Error updating note:", error)
      toast({
        title: "Error",
        description: `Failed to update note: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No clinical notes recorded for this patient.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {note.care_professional_name || "Unknown Professional"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{note.note_type}</Badge>
              {note.is_private && <Badge variant="secondary">Private</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">{note.content}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{format(new Date(note.note_date), "PPP 'at' p")}</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditClick(note)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(note.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <ConfirmDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this note? This action cannot be undone."
      />

      {editingNote && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
              <DialogDescription>Update the clinical note.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-note-type">Note Type</Label>
                <Select value={editedNoteType} onValueChange={setEditedNoteType}>
                  <SelectTrigger id="edit-note-type">
                    <SelectValue placeholder="Select note type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Assessment">Assessment</SelectItem>
                    <SelectItem value="Progress">Progress</SelectItem>
                    <SelectItem value="Medication">Medication</SelectItem>
                    <SelectItem value="Incident">Incident</SelectItem>
                    <SelectItem value="Care Plan Review">Care Plan Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  placeholder="Enter note content..."
                  className="resize-none"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-is-private"
                  checked={editedIsPrivate}
                  onCheckedChange={(checked) => setEditedIsPrivate(Boolean(checked))}
                />
                <Label htmlFor="edit-is-private">Mark as Private</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateNote}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MoreHorizontal, Search, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { deleteClinicalNote, type ClinicalNote, type ClinicalNoteCategory } from "@/lib/services/clinical-notes-service"
import ViewClinicalNoteDialog from "./view-clinical-note-dialog"
import EditClinicalNoteDialog from "./edit-clinical-note-dialog"

interface ClinicalNotesListProps {
  notes: ClinicalNote[]
  categories: ClinicalNoteCategory[]
  loading: boolean
  onNoteDeleted: (id: string) => void
}

export default function ClinicalNotesList({ notes, categories, loading, onNoteDeleted }: ClinicalNotesListProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewingNote, setViewingNote] = useState<ClinicalNote | null>(null)
  const [editingNote, setEditingNote] = useState<ClinicalNote | null>(null)

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteClinicalNote(id)
      onNoteDeleted(id)
      toast({
        title: "Note deleted",
        description: "The clinical note has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: "Failed to delete the clinical note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleNoteUpdated = (updatedNote: ClinicalNote) => {
    // Replace the old note with the updated one
    const updatedNotes = notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    // This assumes the parent component is passing a state setter function
    // If not, you'll need to modify this to fit your state management approach
    onNoteDeleted(updatedNote.id) // Using this as a trigger to refresh
    setEditingNote(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search notes..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No clinical notes found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <Card key={note.id} className={note.is_important ? "border-orange-500" : undefined}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewingNote(note)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingNote(note)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteNote(note.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {note.category_id && (
                  <Badge variant="outline" style={{ color: note.category_color || undefined }} className="mt-1">
                    {note.category_name}
                  </Badge>
                )}
                <CardDescription className="mt-2">
                  {note.created_at && format(new Date(note.created_at), "PPP")}
                  {note.created_by_name && ` • ${note.created_by_name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm">{note.content}</p>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                {note.is_private && <Badge variant="secondary">Private</Badge>}
                {note.is_important && <Badge variant="destructive">Important</Badge>}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {viewingNote && (
        <ViewClinicalNoteDialog note={viewingNote} open={!!viewingNote} onOpenChange={() => setViewingNote(null)} />
      )}

      {editingNote && (
        <EditClinicalNoteDialog
          note={editingNote}
          categories={categories}
          open={!!editingNote}
          onOpenChange={() => setEditingNote(null)}
          onNoteUpdated={handleNoteUpdated}
        />
      )}
    </div>
  )
}

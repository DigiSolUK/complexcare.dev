"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Plus, Filter, FileText } from "lucide-react"
import { format } from "date-fns"
import { CreateClinicalNoteDialog } from "@/components/clinical-notes/create-clinical-note-dialog"

interface ClinicalNote {
  id: string
  title: string
  content: string
  category: string
  importance: string
  privacy_level: string
  created_at: string
  created_by: string
  tags: string[]
}

interface PatientClinicalNotesClientProps {
  patientId: string
}

export function PatientClinicalNotesClient({ patientId }: PatientClinicalNotesClientProps) {
  const [notes, setNotes] = useState<ClinicalNote[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    async function fetchNotes() {
      try {
        setLoading(true)
        const response = await fetch(`/api/patients/${patientId}/clinical-notes`)

        if (response.ok) {
          const data = await response.json()
          setNotes(data)
        }
      } catch (error) {
        console.error("Error fetching clinical notes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [patientId])

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clinical Notes</h1>
          <p className="text-muted-foreground">Patient clinical documentation and notes</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clinical notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <CardDescription>
                      {format(new Date(note.created_at), "PPP")} by {note.created_by}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{note.category}</Badge>
                    <Badge
                      variant={
                        note.importance === "high"
                          ? "destructive"
                          : note.importance === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {note.importance}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Clinical Notes</h3>
                <p className="text-muted-foreground mb-4">No clinical notes found for this patient.</p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Note
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateClinicalNoteDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        patientId={patientId}
        onSuccess={() => {
          setShowCreateDialog(false)
          // Refresh notes
          window.location.reload()
        }}
      />
    </div>
  )
}

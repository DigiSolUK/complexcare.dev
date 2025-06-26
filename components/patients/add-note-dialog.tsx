"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { BodyMap } from "@/components/patients/body-map"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import type { CareProfessional } from "@/types"

interface AddNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  onNoteAdded: () => void
}

export function AddNoteDialog({ open, onOpenChange, patientId, onNoteAdded }: AddNoteDialogProps) {
  const { toast } = useToast()
  const [notesContent, setNotesContent] = useState("")
  const [bodyMapAreas, setBodyMapAreas] = useState<string[]>([])
  const [bodyMapNotes, setBodyMapNotes] = useState("")
  const [noteType, setNoteType] = useState("General")
  const [isPrivate, setIsPrivate] = useState(false)
  const [careProfessionals, setCareProfessionals] = useState<CareProfessional[]>([])
  const [selectedCareProfessionalId, setSelectedCareProfessionalId] = useState<string | null>(null)
  const [loadingCareProfessionals, setLoadingCareProfessionals] = useState(true)

  useEffect(() => {
    const fetchCareProfessionals = async () => {
      try {
        setLoadingCareProfessionals(true)
        const response = await fetch("/api/care-professionals")
        if (!response.ok) {
          throw new Error("Failed to fetch care professionals")
        }
        const data: CareProfessional[] = await response.json()
        setCareProfessionals(data)
        if (data.length > 0) {
          setSelectedCareProfessionalId(data[0].id) // Auto-select first professional
        }
      } catch (error: any) {
        console.error("Error fetching care professionals:", error)
        toast({
          title: "Error",
          description: `Failed to load care professionals: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        setLoadingCareProfessionals(false)
      }
    }

    if (open) {
      fetchCareProfessionals()
    }
  }, [open, toast])

  const handleAddNote = async () => {
    if (!selectedCareProfessionalId) {
      toast({
        title: "Error",
        description: "Please select a care professional.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/patient-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientId,
          care_professional_id: selectedCareProfessionalId,
          note_type: noteType,
          content: notesContent,
          is_private: isPrivate,
          // Body map data can be included in content or a separate JSONB field if schema allows
          // For now, let's append it to content for simplicity if not a dedicated field
          // Or pass it as part of the 'notes' field if the backend expects it.
          // For this example, we'll just use the 'notesContent' for the main content.
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add note")
      }

      toast({
        title: "Success",
        description: "Note added successfully.",
      })
      setNotesContent("")
      setBodyMapAreas([])
      setBodyMapNotes("")
      setNoteType("General")
      setIsPrivate(false)
      setSelectedCareProfessionalId(null)
      onNoteAdded()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Failed to add note:", error)
      toast({
        title: "Error",
        description: `Failed to add note: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
          <DialogDescription>Record a new clinical note for the patient</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="care-professional">Care Professional</Label>
            <Select
              value={selectedCareProfessionalId || ""}
              onValueChange={setSelectedCareProfessionalId}
              disabled={loadingCareProfessionals}
            >
              <SelectTrigger id="care-professional">
                <SelectValue placeholder="Select care professional" />
              </SelectTrigger>
              <SelectContent>
                {careProfessionals.map((cp) => (
                  <SelectItem key={cp.id} value={cp.id}>
                    {cp.first_name} {cp.last_name} ({cp.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loadingCareProfessionals && <p className="text-sm text-muted-foreground">Loading care professionals...</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note-type">Note Type</Label>
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger id="note-type">
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
            <Label htmlFor="notes-content">Notes Content</Label>
            <Textarea
              id="notes-content"
              placeholder="Enter clinical notes..."
              className="resize-none"
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Body Map (Optional)</Label>
            <BodyMap
              selectedAreas={bodyMapAreas}
              onChange={(areas) => setBodyMapAreas(areas)}
              notes={bodyMapNotes}
              onNotesChange={(notes) => setBodyMapNotes(notes)}
            />
            <p className="text-sm text-muted-foreground">
              Selected areas: {bodyMapAreas.length > 0 ? bodyMapAreas.join(", ") : "None"}
            </p>
            {bodyMapNotes && <p className="text-sm text-muted-foreground">Body Map Notes: {bodyMapNotes}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-private"
              checked={isPrivate}
              onCheckedChange={(checked) => setIsPrivate(Boolean(checked))}
            />
            <Label htmlFor="is-private">Mark as Private</Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleAddNote}>
            Add Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

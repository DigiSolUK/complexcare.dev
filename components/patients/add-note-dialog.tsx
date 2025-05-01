"use client"

import { useState } from "react"
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

interface AddNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNoteAdded: (note: { notes: string; bodyMapAreas: string[]; bodyMapNotes: string }) => void
}

export function AddNoteDialog({ open, onOpenChange, onNoteAdded }: AddNoteDialogProps) {
  const [notes, setNotes] = useState("")
  const [bodyMapAreas, setBodyMapAreas] = useState<string[]>([])
  const [bodyMapNotes, setBodyMapNotes] = useState("")

  const handleAddNote = async () => {
    try {
      await onNoteAdded({ notes, bodyMapAreas, bodyMapNotes })
      setNotes("")
      setBodyMapAreas([])
      setBodyMapNotes("")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to add note:", error)
      // You can add toast notification here if you have a toast component
      // toast.error("Failed to add note. Please try again.");
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
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter clinical notes..."
              className="resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Body Map</Label>
            <BodyMap
              selectedAreas={bodyMapAreas}
              onChange={(areas) => setBodyMapAreas(areas)}
              notes={bodyMapNotes}
              onNotesChange={(notes) => setBodyMapNotes(notes)}
            />
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

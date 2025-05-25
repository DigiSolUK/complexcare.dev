"use client"

import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ClinicalNote } from "@/lib/services/clinical-notes-service"

interface ViewClinicalNoteDialogProps {
  note: ClinicalNote
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ViewClinicalNoteDialog({ note, open, onOpenChange }: ViewClinicalNoteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{note.title}</DialogTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {note.category_name && (
              <Badge variant="outline" style={{ color: note.category_color || undefined }}>
                {note.category_name}
              </Badge>
            )}
            {note.is_private && <Badge variant="secondary">Private</Badge>}
            {note.is_important && <Badge variant="destructive">Important</Badge>}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {note.created_at && <span>Created: {format(new Date(note.created_at), "PPP p")}</span>}
            {note.created_by_name && <span> by {note.created_by_name}</span>}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] mt-2">
          <div className="whitespace-pre-wrap">{note.content}</div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

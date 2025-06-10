"use client"

import { format } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { ClinicalNote } from "@/types"

interface ViewClinicalNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  note: ClinicalNote
}

export function ViewClinicalNoteDialog({ open, onOpenChange, note }: ViewClinicalNoteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
          <DialogDescription>Note recorded on {format(new Date(note.noteDate), "PPP 'at' p")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Patient:</span>
            <span className="col-span-3 text-sm">{note.patientName || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Care Professional:</span>
            <span className="col-span-3 text-sm">{note.careProfessionalName || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Category:</span>
            <span className="col-span-3 text-sm">{note.categoryName || "N/A"}</span>
          </div>
          {note.templateName && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Template Used:</span>
              <span className="col-span-3 text-sm">{note.templateName}</span>
            </div>
          )}
          <Separator />
          <div>
            <h3 className="text-base font-semibold mb-2">Note Content:</h3>
            <div
              className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: note.content.replace(/\n/g, "<br />") }}
            />
          </div>
          <Separator />
          <div className="text-xs text-muted-foreground">
            Created: {format(new Date(note.createdAt), "PPP p")} | Last Updated:{" "}
            {format(new Date(note.updatedAt), "PPP p")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

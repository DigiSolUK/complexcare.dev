"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Calendar, Tag, Paperclip, Download, User, Clock } from "lucide-react"
import { format, parseISO } from "date-fns"
import {
  type ClinicalNote,
  type ClinicalNoteAttachment,
  getAttachmentsByNoteId,
} from "@/lib/services/clinical-notes-service"

interface ViewClinicalNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  note: ClinicalNote
}

export function ViewClinicalNoteDialog({ open, onOpenChange, note }: ViewClinicalNoteDialogProps) {
  const [attachments, setAttachments] = useState<ClinicalNoteAttachment[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAttachments = async () => {
      if (!open || !note) return

      setIsLoading(true)
      try {
        const attachmentsData = await getAttachmentsByNoteId(note.id)
        setAttachments(attachmentsData)
      } catch (error) {
        console.error("Error fetching attachments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttachments()
  }, [open, note])

  if (!note) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{note.title}</DialogTitle>
            {note.is_important && <AlertTriangle className="h-4 w-4 text-red-500" />}
            {note.is_private && (
              <Badge variant="outline" className="text-xs">
                Private
              </Badge>
            )}
          </div>
          <DialogDescription className="flex items-center gap-2">
            {note.category_name && (
              <Badge style={{ backgroundColor: note.category_color || undefined }}>{note.category_name}</Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <User className="h-4 w-4" />
          <span>Created by {note.created_by_name || "Unknown"}</span>
          <Clock className="h-4 w-4 ml-2" />
          <span>{format(parseISO(note.created_at), "PPP p")}</span>
        </div>

        <Separator className="my-2" />

        <div className="whitespace-pre-wrap text-sm">{note.content}</div>

        {note.follow_up_date && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex items-center gap-2 font-medium mb-1">
              <Calendar className="h-4 w-4" />
              <span>Follow-up: {format(parseISO(note.follow_up_date), "PPP")}</span>
            </div>
            {note.follow_up_notes && <div className="text-sm">{note.follow_up_notes}</div>}
          </div>
        )}

        {note.tags && note.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-4">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Attachments ({attachments.length})
            </h4>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="text-sm truncate">{attachment.file_name}</div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

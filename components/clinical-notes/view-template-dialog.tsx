"use client"

import { format } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { ClinicalNoteTemplate } from "@/types"

interface ViewTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: ClinicalNoteTemplate
}

export function ViewTemplateDialog({ open, onOpenChange, template }: ViewTemplateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>Template in category: {template.categoryName || "N/A"}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Category:</span>
            <span className="col-span-3 text-sm">{template.categoryName || "N/A"}</span>
          </div>
          <Separator />
          <div>
            <h3 className="text-base font-semibold mb-2">Template Content:</h3>
            <div
              className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: template.content.replace(/\n/g, "<br />") }}
            />
          </div>
          <Separator />
          <div className="text-xs text-muted-foreground">
            Created: {format(new Date(template.createdAt), "PPP p")} | Last Updated:{" "}
            {format(new Date(template.updatedAt), "PPP p")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

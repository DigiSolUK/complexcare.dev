"use client"

import { useState } from "react"
import type { ClinicalNoteTemplate } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Eye, Trash } from "lucide-react"
import { ViewTemplateDialog } from "./view-template-dialog"
import { EditTemplateDialog } from "./edit-template-dialog"
import { DeleteConfirmationDialog } from "@/components/data-management/delete-confirmation-dialog"
import { deleteClinicalNoteTemplate } from "@/lib/actions/clinical-notes-actions"
import { useToast } from "@/components/ui/use-toast"

export function ClinicalNoteTemplatesList({
  // Changed to named export
  templates,
  onTemplateUpdated,
  onTemplateDeleted,
}: { templates: ClinicalNoteTemplate[]; onTemplateUpdated: () => void; onTemplateDeleted: () => void }) {
  const [viewTemplate, setViewTemplate] = useState<ClinicalNoteTemplate | null>(null)
  const [editTemplate, setEditTemplate] = useState<ClinicalNoteTemplate | null>(null)
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (deleteTemplateId) {
      try {
        const result = await deleteClinicalNoteTemplate(deleteTemplateId)
        if (result.success) {
          toast({
            title: "Success",
            description: "Template deleted successfully.",
          })
          onTemplateDeleted()
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete template.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting template:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
      } finally {
        setDeleteTemplateId(null)
      }
    }
  }

  if (templates.length === 0) {
    return <p className="text-center text-muted-foreground">No templates found.</p>
  }

  return (
    <div className="grid gap-4">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">{template.title}</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setViewTemplate(template)}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View template</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setEditTemplate(template)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit template</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteTemplateId(template.id)}>
                <Trash className="h-4 w-4 text-red-500" />
                <span className="sr-only">Delete template</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{template.content}</p>
          </CardContent>
        </Card>
      ))}

      {viewTemplate && (
        <ViewTemplateDialog open={!!viewTemplate} onOpenChange={() => setViewTemplate(null)} template={viewTemplate} />
      )}

      {editTemplate && (
        <EditTemplateDialog
          open={!!editTemplate}
          onOpenChange={() => setEditTemplate(null)}
          template={editTemplate}
          onTemplateUpdated={() => {
            onTemplateUpdated()
            setEditTemplate(null) // Close dialog after update
          }}
        />
      )}

      {deleteTemplateId && (
        <DeleteConfirmationDialog
          open={!!deleteTemplateId}
          onOpenChange={() => setDeleteTemplateId(null)}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          description="Are you sure you want to delete this template? This action cannot be undone."
        />
      )}
    </div>
  )
}

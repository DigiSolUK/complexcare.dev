"use client"

import { useState } from "react"
import type { ClinicalNoteCategory } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash } from "lucide-react"
import { EditCategoryDialog } from "./edit-category-dialog"
import { DeleteConfirmationDialog } from "@/components/data-management/delete-confirmation-dialog"
import { deleteClinicalNoteCategory } from "@/lib/actions/clinical-notes-actions"
import { useToast } from "@/components/ui/use-toast"

export function ClinicalNoteCategoriesList({
  categories,
  onCategoryUpdated,
  onCategoryDeleted,
}: { categories: ClinicalNoteCategory[]; onCategoryUpdated: () => void; onCategoryDeleted: () => void }) {
  const [editCategory, setEditCategory] = useState<ClinicalNoteCategory | null>(null)
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (deleteCategoryId) {
      try {
        const result = await deleteClinicalNoteCategory(deleteCategoryId)
        if (result.success) {
          toast({
            title: "Success",
            description: "Category deleted successfully.",
          })
          onCategoryDeleted()
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete category.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting category:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
      } finally {
        setDeleteCategoryId(null)
      }
    }
  }

  if (categories.length === 0) {
    return <p className="text-center text-muted-foreground">No categories found.</p>
  }

  return (
    <div className="grid gap-4">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">{category.name}</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setEditCategory(category)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit category</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteCategoryId(category.id)}>
                <Trash className="h-4 w-4 text-red-500" />
                <span className="sr-only">Delete category</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{category.description || "No description provided."}</p>
          </CardContent>
        </Card>
      ))}

      {editCategory && (
        <EditCategoryDialog
          open={!!editCategory}
          onOpenChange={() => setEditCategory(null)}
          category={editCategory}
          onCategoryUpdated={() => {
            onCategoryUpdated()
            setEditCategory(null) // Close dialog after update
          }}
        />
      )}

      {deleteCategoryId && (
        <DeleteConfirmationDialog
          open={!!deleteCategoryId}
          onOpenChange={() => setDeleteCategoryId(null)}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          description="Are you sure you want to delete this category? This action cannot be undone."
        />
      )}
    </div>
  )
}

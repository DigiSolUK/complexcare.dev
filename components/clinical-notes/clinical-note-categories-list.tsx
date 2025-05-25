"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2 } from "lucide-react"
import { type ClinicalNoteCategory, getClinicalNoteCategories } from "@/lib/services/clinical-notes-service"
import { CreateCategoryDialog } from "@/components/clinical-notes/create-category-dialog"

export function ClinicalNoteCategoriesList() {
  const [categories, setCategories] = useState<ClinicalNoteCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getClinicalNoteCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCreateCategory = () => {
    setIsCreateDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Note Categories</h2>
        <Button onClick={handleCreateCategory}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center py-8 text-muted-foreground">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">No categories found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color || "#CBD5E1" }} />
                </div>
                {category.description && <CardDescription>{category.description}</CardDescription>}
              </CardHeader>
              <CardFooter className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateCategoryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          // Refresh categories
          getClinicalNoteCategories().then(setCategories)
        }}
      />
    </div>
  )
}

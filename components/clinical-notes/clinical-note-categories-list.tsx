"use client"

import { Button } from "@/components/ui/button"
import type { ClinicalNoteCategory } from "@/lib/services/clinical-notes-service"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface ClinicalNoteCategoriesListProps {
  categories: ClinicalNoteCategory[]
  selectedCategory?: string | null
  onSelectCategory?: (categoryId: string | null) => void
  loading?: boolean
}

export default function ClinicalNoteCategoriesList({
  categories,
  selectedCategory = null,
  onSelectCategory,
  loading = false,
}: ClinicalNoteCategoriesListProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {onSelectCategory && (
        <Button
          variant="ghost"
          className={cn("w-full justify-start", !selectedCategory && "bg-muted font-medium")}
          onClick={() => onSelectCategory(null)}
        >
          All Categories
        </Button>
      )}

      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground p-2">No categories found</p>
      ) : (
        categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className={cn("w-full justify-start", selectedCategory === category.id && "bg-muted font-medium")}
            onClick={() => onSelectCategory?.(category.id)}
          >
            {category.icon && <span className="mr-2">{category.icon}</span>}
            <span className="flex items-center" style={category.color ? { color: category.color } : undefined}>
              {category.name}
            </span>
          </Button>
        ))
      )}
    </div>
  )
}

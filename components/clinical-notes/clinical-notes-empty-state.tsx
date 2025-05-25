"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface ClinicalNotesEmptyStateProps {
  onAddNote?: () => void
}

export function ClinicalNotesEmptyState({ onAddNote }: ClinicalNotesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative h-40 w-40 mb-6">
        <Image src="/images/empty-states/no-notes.png" alt="No clinical notes found" fill className="object-contain" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No clinical notes found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        There are no clinical notes for this patient yet. Add your first note to start documenting their care.
      </p>
      <Button onClick={onAddNote}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add First Clinical Note
      </Button>
    </div>
  )
}

"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface TasksEmptyStateProps {
  onAddTask?: () => void
}

export function TasksEmptyState({ onAddTask }: TasksEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative h-40 w-40 mb-6">
        <Image src="/images/empty-states/no-tasks.png" alt="No tasks found" fill className="object-contain" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        You don't have any tasks assigned to you. Create a new task to get started.
      </p>
      <Button onClick={onAddTask}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create New Task
      </Button>
    </div>
  )
}

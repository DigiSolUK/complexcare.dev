"use client"

import { useState, useEffect } from "react"
import { TaskTable } from "./task-table"
import { TaskService } from "@/lib/services/task-service"
import { useToast } from "@/components/ui/use-toast"
import type { Task } from "@/types"

interface TodoListProps {
  todos: Task[] // Now receives tasks as props
}

export function TodoList({ todos }: TodoListProps) {
  const [tasks, setTasks] = useState<Task[]>(todos)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Update local state when props change
  useEffect(() => {
    setTasks(todos)
  }, [todos])

  const refreshTasks = async () => {
    setIsLoading(true)
    try {
      const taskService = await TaskService.create()
      const fetchedTasks = await taskService.getTasks() // Fetch all tasks for now
      setTasks(fetchedTasks)
    } catch (error) {
      console.error("Failed to refresh tasks:", error)
      toast({
        title: "Error",
        description: "Failed to refresh tasks.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Loading tasks...</p>
        </div>
      ) : (
        <TaskTable data={tasks} onTaskUpdated={refreshTasks} />
      )}
    </div>
  )
}

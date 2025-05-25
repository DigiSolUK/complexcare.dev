import type { Metadata } from "next"
import { Suspense } from "react"
import { TasksClient } from "./tasks-client"
import { getMockTasks } from "@/lib/mock-data/tasks"

export const metadata: Metadata = {
  title: "Tasks",
  description: "Manage your tasks and to-dos",
}

export default async function TasksPage() {
  // In a real app, this would fetch from the database
  // For preview, we'll use mock data
  const tasks = getMockTasks()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
      </div>

      <Suspense fallback={<div>Loading tasks...</div>}>
        <TasksClient initialTasks={tasks} />
      </Suspense>
    </div>
  )
}

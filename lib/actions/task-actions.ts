"use server"

import { TaskService } from "@/lib/services/task-service"
import type { Task } from "@/types"
import { revalidatePath } from "next/cache"

export async function createTask(
  taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "tenantId" | "assignedToName" | "patientName">,
) {
  try {
    const taskService = await TaskService.create()
    const newTask = await taskService.createTask(taskData)
    revalidatePath("/dashboard/tasks")
    revalidatePath("/dashboard") // Revalidate dashboard for task list
    return { success: true, data: newTask }
  } catch (error: any) {
    console.error("Error creating task:", error)
    return { success: false, error: error.message || "Failed to create task" }
  }
}

export async function updateTask(
  id: string,
  taskData: Partial<Omit<Task, "id" | "createdAt" | "updatedAt" | "tenantId" | "assignedToName" | "patientName">>,
) {
  try {
    const taskService = await TaskService.create()
    const updatedTask = await taskService.updateTask(id, taskData)
    revalidatePath("/dashboard/tasks")
    revalidatePath("/dashboard")
    return { success: true, data: updatedTask }
  } catch (error: any) {
    console.error("Error updating task:", error)
    return { success: false, error: error.message || "Failed to update task" }
  }
}

export async function deleteTask(id: string) {
  try {
    const taskService = await TaskService.create()
    const success = await taskService.deleteTask(id)
    revalidatePath("/dashboard/tasks")
    revalidatePath("/dashboard")
    return { success: success }
  } catch (error: any) {
    console.error("Error deleting task:", error)
    return { success: false, error: error.message || "Failed to delete task" }
  }
}

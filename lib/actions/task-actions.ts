"use server"

import { revalidatePath } from "next/cache"
import { TaskService } from "@/lib/services/task-service" // Import the class
import type { Task, TaskStatus } from "@/types"
import { AppError } from "@/lib/error-handler"

export async function getTasksAction(filters?: {
  status?: TaskStatus
  assignedToId?: string
  patientId?: string
  dueDateBefore?: Date
  dueDateAfter?: Date
}) {
  try {
    const taskService = await TaskService.create()
    const tasks = await taskService.getTasks(filters)
    return { success: true, data: tasks }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

export async function getTaskByIdAction(id: string) {
  try {
    const taskService = await TaskService.create()
    const task = await taskService.getTaskById(id)
    if (!task) {
      throw new AppError("Task not found", 404)
    }
    return { success: true, data: task }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

export async function createTaskAction(
  taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "tenantId" | "assignedToName" | "patientName">,
) {
  try {
    const taskService = await TaskService.create()
    const newTask = await taskService.createTask(taskData)
    revalidatePath("/dashboard/tasks")
    revalidatePath("/patients/[id]") // Revalidate patient detail page if task is linked
    return { success: true, data: newTask }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

export async function updateTaskAction(
  id: string,
  taskData: Partial<Omit<Task, "id" | "createdAt" | "updatedAt" | "tenantId" | "assignedToName" | "patientName">>,
) {
  try {
    const taskService = await TaskService.create()
    const updatedTask = await taskService.updateTask(id, taskData)
    if (!updatedTask) {
      throw new AppError("Task not found or unauthorized to update", 404)
    }
    revalidatePath("/dashboard/tasks")
    revalidatePath("/patients/[id]") // Revalidate patient detail page if task is linked
    return { success: true, data: updatedTask }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

export async function deleteTaskAction(id: string) {
  try {
    const taskService = await TaskService.create()
    const success = await taskService.deleteTask(id)
    if (!success) {
      throw new AppError("Failed to delete task", 500)
    }
    revalidatePath("/dashboard/tasks")
    revalidatePath("/patients/[id]") // Revalidate patient detail page if task was linked
    return { success: true, message: "Task deleted successfully" }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

export async function getTasksByAssigneeAction(
  assigneeId: string,
  filters?: { status?: TaskStatus; patientId?: string; dueDateBefore?: Date; dueDateAfter?: Date },
) {
  try {
    const taskService = await TaskService.create()
    const tasks = await taskService.getTasksByAssignee(assigneeId, filters)
    return { success: true, data: tasks }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

export async function getTasksByPatientAction(
  patientId: string,
  filters?: { status?: TaskStatus; assigneeId?: string; dueDateBefore?: Date; dueDateAfter?: Date },
) {
  try {
    const taskService = await TaskService.create()
    const tasks = await taskService.getTasksByPatient(patientId, filters)
    return { success: true, data: tasks }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

export async function updateTaskStatusAction(id: string, status: TaskStatus) {
  try {
    const taskService = await TaskService.create()
    const updatedTask = await taskService.updateTaskStatus(id, status)
    if (!updatedTask) {
      throw new AppError("Task not found or unauthorized to update status", 404)
    }
    revalidatePath("/dashboard/tasks")
    revalidatePath("/patients/[id]")
    return { success: true, data: updatedTask }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

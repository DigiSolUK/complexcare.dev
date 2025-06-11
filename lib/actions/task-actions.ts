"use server"

import { revalidatePath } from "next/cache"
import {
  getTasks,
  getTaskById,
  createTask as createTaskService,
  updateTask as updateTaskService, // Renamed to avoid conflict
  deleteTask as deleteTaskService, // Renamed to avoid conflict
  getTasksByAssignee,
  getTasksByPatient,
  updateTaskStatus,
} from "@/lib/services/task-service"
import { getCurrentUser } from "@/lib/auth-utils"
import { AppError } from "@/lib/error-handler"
import type { Task, TaskStatus } from "@/types"

export async function getTasksAction(filters?: {
  status?: TaskStatus
  assignedToId?: string
  patientId?: string
  dueDateBefore?: Date
  dueDateAfter?: Date
}) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }
    const tasks = await getTasks(user.tenantId, filters)
    return { success: true, data: tasks }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

export async function getTaskByIdAction(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }
    const task = await getTaskById(id, user.tenantId)
    if (!task) {
      throw new AppError("Task not found", 404)
    }
    return { success: true, data: task }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

export async function createTask(
  taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "tenantId" | "assignedToName" | "patientName">,
) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }
    const newTask = await createTaskService({ ...taskData, tenant_id: user.tenantId })
    revalidatePath("/dashboard/tasks")
    revalidatePath("/patients/[id]") // Revalidate patient detail page if task is linked
    return { success: true, data: newTask }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

export async function updateTask(
  id: string,
  taskData: Partial<Omit<Task, "id" | "createdAt" | "updatedAt" | "tenantId" | "assignedToName" | "patientName">>,
) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }
    const updatedTask = await updateTaskService(id, user.tenantId, taskData)
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

export async function deleteTask(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }
    const success = await deleteTaskService(id, user.tenantId)
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
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }
    const tasks = await getTasksByAssignee(assigneeId, user.tenantId, filters)
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
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }
    const tasks = await getTasksByPatient(patientId, user.tenantId, filters)
    return { success: true, data: tasks }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

export async function updateTaskStatusAction(id: string, status: TaskStatus) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }
    const updatedTask = await updateTaskStatus(id, user.tenantId, status)
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

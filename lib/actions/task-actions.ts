"use server"

import { revalidatePath } from "next/cache"
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
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
    const task = await getTaskById(id)
    if (!task || task.tenantId !== user.tenantId) {
      throw new AppError("Task not found or unauthorized access", 404)
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
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }
    const newTask = await createTask({ ...taskData, tenant_id: user.tenantId })
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
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }
    const updatedTask = await updateTask(id, taskData)
    if (!updatedTask || updatedTask.tenantId !== user.tenantId) {
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
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }
    const task = await getTaskById(id)
    if (!task || task.tenantId !== user.tenantId) {
      throw new AppError("Task not found or unauthorized to delete", 404)
    }
    const success = await deleteTask(id)
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
    const updatedTask = await updateTaskStatus(id, status)
    if (!updatedTask || updatedTask.tenantId !== user.tenantId) {
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

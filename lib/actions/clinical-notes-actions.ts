"use server"

import { ClinicalNotesService } from "@/lib/services/clinical-notes-service"
import type { ClinicalNote, ClinicalNoteCategory, ClinicalNoteTemplate } from "@/types"
import { revalidatePath } from "next/cache"

// --- Clinical Notes Actions ---

export async function getClinicalNotes(patientId?: string) {
  try {
    const service = await ClinicalNotesService.create()
    const notes = await service.getNotes(patientId)
    return { success: true, data: notes }
  } catch (error: any) {
    console.error("Error fetching clinical notes:", error)
    return { success: false, error: error.message || "Failed to fetch clinical notes" }
  }
}

export async function getClinicalNoteById(id: string) {
  try {
    const service = await ClinicalNotesService.create()
    const note = await service.getNoteById(id)
    if (!note) {
      return { success: false, error: "Clinical note not found" }
    }
    return { success: true, data: note }
  } catch (error: any) {
    console.error("Error fetching clinical note by ID:", error)
    return { success: false, error: error.message || "Failed to fetch clinical note" }
  }
}

export async function createClinicalNote(
  noteData: Omit<
    ClinicalNote,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "tenantId"
    | "patientName"
    | "careProfessionalName"
    | "categoryName"
    | "templateName"
  >,
) {
  try {
    const service = await ClinicalNotesService.create()
    const newNote = await service.createNote(noteData)
    revalidatePath("/clinical-notes")
    revalidatePath(`/patients/${noteData.patientId}`) // Revalidate patient detail page
    return { success: true, data: newNote }
  } catch (error: any) {
    console.error("Error creating clinical note:", error)
    return { success: false, error: error.message || "Failed to create clinical note" }
  }
}

export async function updateClinicalNote(
  id: string,
  noteData: Partial<
    Omit<
      ClinicalNote,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "tenantId"
      | "patientName"
      | "careProfessionalName"
      | "categoryName"
      | "templateName"
    >
  >,
) {
  try {
    const service = await ClinicalNotesService.create()
    const updatedNote = await service.updateNote(id, noteData)
    if (!updatedNote) {
      return { success: false, error: "Clinical note not found or update failed" }
    }
    revalidatePath("/clinical-notes")
    if (updatedNote.patientId) {
      revalidatePath(`/patients/${updatedNote.patientId}`)
    }
    return { success: true, data: updatedNote }
  } catch (error: any) {
    console.error("Error updating clinical note:", error)
    return { success: false, error: error.message || "Failed to update clinical note" }
  }
}

export async function deleteClinicalNote(id: string) {
  try {
    const service = await ClinicalNotesService.create()
    const note = await service.getNoteById(id) // Get note to revalidate patient path
    const success = await service.deleteNote(id)
    if (!success) {
      return { success: false, error: "Clinical note not found or deletion failed" }
    }
    revalidatePath("/clinical-notes")
    if (note?.patientId) {
      revalidatePath(`/patients/${note.patientId}`)
    }
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting clinical note:", error)
    return { success: false, error: error.message || "Failed to delete clinical note" }
  }
}

// --- Clinical Note Categories Actions ---

export async function getClinicalNoteCategories() {
  try {
    const service = await ClinicalNotesService.create()
    const categories = await service.getCategories()
    return { success: true, data: categories }
  } catch (error: any) {
    console.error("Error fetching clinical note categories:", error)
    return { success: false, error: error.message || "Failed to fetch clinical note categories" }
  }
}

export async function createClinicalNoteCategory(
  categoryData: Omit<ClinicalNoteCategory, "id" | "createdAt" | "updatedAt" | "tenantId">,
) {
  try {
    const service = await ClinicalNotesService.create()
    const newCategory = await service.createCategory(categoryData)
    revalidatePath("/clinical-notes") // Revalidate main notes page
    return { success: true, data: newCategory }
  } catch (error: any) {
    console.error("Error creating clinical note category:", error)
    return { success: false, error: error.message || "Failed to create clinical note category" }
  }
}

export async function updateClinicalNoteCategory(
  id: string,
  categoryData: Partial<Omit<ClinicalNoteCategory, "id" | "createdAt" | "updatedAt" | "tenantId">>,
) {
  try {
    const service = await ClinicalNotesService.create()
    const updatedCategory = await service.updateCategory(id, categoryData)
    if (!updatedCategory) {
      return { success: false, error: "Clinical note category not found or update failed" }
    }
    revalidatePath("/clinical-notes")
    return { success: true, data: updatedCategory }
  } catch (error: any) {
    console.error("Error updating clinical note category:", error)
    return { success: false, error: error.message || "Failed to update clinical note category" }
  }
}

export async function deleteClinicalNoteCategory(id: string) {
  try {
    const service = await ClinicalNotesService.create()
    const success = await service.deleteCategory(id)
    if (!success) {
      return { success: false, error: "Clinical note category not found or deletion failed" }
    }
    revalidatePath("/clinical-notes")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting clinical note category:", error)
    return { success: false, error: error.message || "Failed to delete clinical note category" }
  }
}

// --- Clinical Note Templates Actions ---

export async function getClinicalNoteTemplates(categoryId?: string) {
  try {
    const service = await ClinicalNotesService.create()
    const templates = await service.getTemplates(categoryId)
    return { success: true, data: templates }
  } catch (error: any) {
    console.error("Error fetching clinical note templates:", error)
    return { success: false, error: error.message || "Failed to fetch clinical note templates" }
  }
}

export async function createClinicalNoteTemplate(
  templateData: Omit<ClinicalNoteTemplate, "id" | "createdAt" | "updatedAt" | "tenantId" | "categoryName">,
) {
  try {
    const service = await ClinicalNotesService.create()
    const newTemplate = await service.createTemplate(templateData)
    revalidatePath("/clinical-notes")
    return { success: true, data: newTemplate }
  } catch (error: any) {
    console.error("Error creating clinical note template:", error)
    return { success: false, error: error.message || "Failed to create clinical note template" }
  }
}

export async function updateClinicalNoteTemplate(
  id: string,
  templateData: Partial<Omit<ClinicalNoteTemplate, "id" | "createdAt" | "updatedAt" | "tenantId" | "categoryName">>,
) {
  try {
    const service = await ClinicalNotesService.create()
    const updatedTemplate = await service.updateTemplate(id, templateData)
    if (!updatedTemplate) {
      return { success: false, error: "Clinical note template not found or update failed" }
    }
    revalidatePath("/clinical-notes")
    return { success: true, data: updatedTemplate }
  } catch (error: any) {
    console.error("Error updating clinical note template:", error)
    return { success: false, error: error.message || "Failed to update clinical note template" }
  }
}

export async function deleteClinicalNoteTemplate(id: string) {
  try {
    const service = await ClinicalNotesService.create()
    const success = await service.deleteTemplate(id)
    if (!success) {
      return { success: false, error: "Clinical note template not found or deletion failed" }
    }
    revalidatePath("/clinical-notes")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting clinical note template:", error)
    return { success: false, error: error.message || "Failed to delete clinical note template" }
  }
}

import { z } from "zod"

export const patientNoteSchema = z.object({
  patient_id: z.string().uuid("Invalid Patient ID"),
  care_professional_id: z.string().uuid("Invalid Care Professional ID"),
  note_type: z.string().min(1, "Note type is required"),
  content: z.string().min(1, "Content cannot be empty"),
  is_private: z.boolean().default(false),
})

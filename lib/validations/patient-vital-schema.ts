import { z } from "zod"

export const createPatientVitalSchema = z.object({
  patient_id: z.string().uuid("Invalid patient ID format."),
  recorded_at: z.string().datetime({ message: "Recorded at must be a valid datetime string." }).optional(),
  blood_pressure_systolic: z.number().int().positive("Systolic BP must be a positive integer.").optional().nullable(),
  blood_pressure_diastolic: z.number().int().positive("Diastolic BP must be a positive integer.").optional().nullable(),
  heart_rate: z.number().int().positive("Heart rate must be a positive integer.").optional().nullable(),
  temperature: z.number().min(20).max(45).optional().nullable(), // Assuming Celsius range
  respiratory_rate: z.number().int().positive("Respiratory rate must be a positive integer.").optional().nullable(),
  oxygen_saturation: z.number().int().min(0).max(100).optional().nullable(), // Percentage
  weight: z.number().positive("Weight must be a positive number.").optional().nullable(),
  height: z.number().positive("Height must be a positive number.").optional().nullable(),
  bmi: z.number().optional().nullable(), // BMI can be calculated or provided
  notes: z.string().max(1000).optional().nullable(),
})

export const updatePatientVitalSchema = createPatientVitalSchema.partial().extend({
  id: z.string().uuid("Invalid vital ID format.").optional(), // ID is required for update but optional in partial
})

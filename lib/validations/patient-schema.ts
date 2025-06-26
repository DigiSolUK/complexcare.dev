import { z } from "zod"

export const patientSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"),
  gender: z.string().optional().nullable(),
  contact_number: z.string().optional().nullable(),
  email: z.string().email("Invalid email address").optional().nullable(),
  address: z.any().optional().nullable(),
  medical_record_number: z.string().optional().nullable(),
  primary_care_provider: z.string().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  status: z.string().optional().default("active"),
  // New medical history fields
  medical_history: z.any().optional().nullable(), // For JSONB
  allergies: z.array(z.string()).optional().nullable(),
  chronic_conditions: z.array(z.string()).optional().nullable(),
  past_surgeries: z.array(z.string()).optional().nullable(),
  family_medical_history: z.any().optional().nullable(), // For JSONB
  immunizations: z.array(z.string()).optional().nullable(),
})

export const updatePatientSchema = patientSchema.partial()

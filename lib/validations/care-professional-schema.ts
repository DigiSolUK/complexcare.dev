import { z } from "zod"

export const careProfessionalSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  phone: z.string().optional().nullable(),
  specialization: z.string().optional().nullable(),
  qualification: z.string().optional().nullable(),
  license_number: z.string().optional().nullable(),
  employment_status: z.string().optional().nullable(),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format")
    .optional()
    .nullable(),
  is_active: z.boolean().default(true),
  address: z.any().optional().nullable(),
  notes: z.string().optional().nullable(),
  emergency_contact_name: z.string().optional().nullable(),
  emergency_contact_phone: z.string().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
})

export const updateCareProfessionalSchema = careProfessionalSchema.partial()

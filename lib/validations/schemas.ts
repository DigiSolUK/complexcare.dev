import { z } from "zod"

// Core ID schemas
export const uuidSchema = z.string().uuid({ message: "Invalid ID format" })
export const tenantIdSchema = z.string().uuid().default("ba367cfe-6de0-4180-9566-1002b75cf82c") // Default for now
export const idSchema = z.string().uuid({ message: "Invalid ID format" })

// Common status enums
export const statusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "completed",
  "in-progress",
  "cancelled",
  "active",
  "inactive",
])
export const prioritySchema = z.enum(["low", "medium", "high", "urgent"])

// Date schemas
export const dateSchema = z.string().refine(
  (val) => {
    if (!val) return true // Allow empty string for optional dates, let .optional() handle it
    return !isNaN(Date.parse(val))
  },
  {
    message: "Invalid date format. Please use YYYY-MM-DD.",
  },
)
export const optionalDateSchema = dateSchema.optional().or(z.literal("")).nullable() // Allow empty string or null

// User schema (basic, might be expanded by Stack Auth)
export const userSchema = z.object({
  id: idSchema,
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().optional(), // Role within a tenant
  tenantId: tenantIdSchema.optional(), // Current active tenant for the user
})

// Emergency Contact Schema
export const emergencyContactSchema = z
  .object({
    name: z.string().optional().nullable(),
    relationship: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
  })
  .optional()
  .nullable()

// Patient schema
export const patientSchema = z.object({
  id: idSchema.optional(),
  tenantId: tenantIdSchema.optional(), // Will be set by server
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: dateSchema.refine((val) => new Date(val) < new Date(), { message: "Date of birth must be in the past" }),
  nhsNumber: z
    .string()
    .regex(/^\d{10}$/, "NHS Number must be 10 digits")
    .optional()
    .or(z.literal(""))
    .nullable(),
  address: z.string().optional().or(z.literal("")).nullable(),
  phone: z.string().optional().or(z.literal("")).nullable(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")).nullable(),
  emergencyContact: emergencyContactSchema,
  // emergencyContact: z.string().optional().or(z.literal("")).nullable(), // Keep as string if you stringify JSON, or use z.object for structured
  createdAt: optionalDateSchema,
  updatedAt: optionalDateSchema,
  deletedAt: optionalDateSchema,
  // Fields from previous demo data that might be useful
  gender: z.enum(["Male", "Female", "Other", "PreferNotToSay"]).optional().nullable(),
  status: z.enum(["active", "inactive", "deceased"]).default("active").optional().nullable(), // Patient's general status
  // primary_condition: z.string().optional().nullable(),
  // primary_care_provider: z.string().optional().nullable(),
  // avatar_url: z.string().url().optional().nullable(),
})

// Timesheet schema
export const timesheetSchema = z
  .object({
    id: idSchema.optional(),
    tenantId: tenantIdSchema,
    userId: idSchema, // This should be care_professional_id if linking to care_professionals table
    careProfessionalId: idSchema.optional(), // Link to care_professionals table
    appointmentId: idSchema.optional(),
    date: dateSchema,
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time format. Use HH:MM"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time format. Use HH:MM"),
    breakDurationMinutes: z.number().int().min(0).default(0).optional(),
    status: statusSchema,
    notes: z.string().optional().nullable(),
    approvedByUserId: idSchema.optional().nullable(),
    approvedAt: optionalDateSchema,
    createdAt: optionalDateSchema,
    updatedAt: optionalDateSchema,
    deletedAt: optionalDateSchema,
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime
      }
      return true
    },
    { message: "End time must be after start time", path: ["endTime"] },
  )

// Timesheet creation schema (subset of full schema)
export const createTimesheetSchema = timesheetSchema.omit({
  id: true,
  tenantId: true, // Will be set by server
  approvedByUserId: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

// Timesheet update schema
export const updateTimesheetSchema = createTimesheetSchema.partial()

// Task schema
export const taskSchema = z.object({
  id: idSchema.optional(),
  tenantId: tenantIdSchema.optional(), // Will be set by server
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  status: statusSchema,
  priority: prioritySchema,
  dueDate: optionalDateSchema,
  assignedToUserId: idSchema.optional().nullable(),
  assignedToCareProfessionalId: idSchema.optional().nullable(),
  patientId: idSchema.optional().nullable(),
  relatedEntityType: z.string().optional().nullable(),
  relatedEntityId: idSchema.optional().nullable(),
  createdByUserId: idSchema.optional(), // Will be set by server from session
  createdAt: optionalDateSchema,
  updatedAt: optionalDateSchema,
  deletedAt: optionalDateSchema,
})

// Care professional schema
export const careProfessionalSchema = z.object({
  id: idSchema.optional(),
  tenantId: tenantIdSchema.optional(), // Will be set by server
  userId: idSchema.optional().nullable(), // Link to a user account if they log in
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string().min(1, "Role is required"), // e.g., 'Nurse', 'Doctor', 'Carer'
  specialization: z.string().optional().nullable(),
  contactNumber: z.string().optional().nullable(),
  email: z.string().email("Invalid email address").optional().nullable(),
  // qualifications: z.array(z.string()).optional(), // Consider a separate table or JSONB
  createdAt: optionalDateSchema,
  updatedAt: optionalDateSchema,
  deletedAt: optionalDateSchema,
})

// Clinical note schema
export const clinicalNoteSchema = z.object({
  id: idSchema.optional(),
  tenantId: tenantIdSchema.optional(), // Will be set by server
  patientId: idSchema,
  careProfessionalId: idSchema.optional().nullable(), // Who wrote the note
  noteDate: dateSchema, // Or datetime-local string if time is important
  content: z.string().min(1, "Note content cannot be empty"),
  categoryId: idSchema.optional().nullable(), // Link to clinical_note_categories
  createdByUserId: idSchema.optional(), // Will be set by server
  createdAt: optionalDateSchema,
  updatedAt: optionalDateSchema,
  deletedAt: optionalDateSchema,
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
})

// Search schema
export const searchSchema = z.object({
  query: z.string().optional(),
  ...paginationSchema.shape,
})

// API response schema (generic wrapper)
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataType: T) =>
  z.object({
    success: z.boolean(),
    data: dataType.optional(),
    error: z.string().optional(),
    errors: z.array(z.object({ message: z.string(), path: z.array(z.string().or(z.number())) })).optional(), // For Zod issues
    meta: z
      .object({
        pagination: z
          .object({
            total: z.number(),
            page: z.number(),
            limit: z.number(),
            pages: z.number(),
          })
          .optional(),
      })
      .optional(),
  })

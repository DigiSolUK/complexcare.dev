import { z } from "zod"

// Core ID schemas
export const uuidSchema = z.string().uuid()
export const tenantIdSchema = z.string().uuid().default("ba367cfe-6de0-4180-9566-1002b75cf82c")
export const idSchema = z.string().uuid()

// Common status enums
export const statusSchema = z.enum(["pending", "approved", "rejected", "completed", "in-progress", "cancelled"])
export const prioritySchema = z.enum(["low", "medium", "high", "urgent"])

// Date schemas
export const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid date format",
})
export const optionalDateSchema = dateSchema.optional()

// User schema
export const userSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().optional(),
  tenantId: tenantIdSchema,
})

// Timesheet schema
export const timesheetSchema = z.object({
  id: idSchema.optional(),
  tenantId: tenantIdSchema,
  userId: idSchema,
  date: dateSchema,
  startTime: z.string(),
  endTime: z.string(),
  breakDuration: z.number().min(0),
  status: statusSchema,
  notes: z.string().optional(),
  approvedBy: idSchema.optional(),
  approvedAt: optionalDateSchema,
  createdAt: optionalDateSchema,
  updatedAt: optionalDateSchema,
})

// Timesheet creation schema (subset of full schema)
export const createTimesheetSchema = timesheetSchema.omit({
  id: true,
  approvedBy: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
})

// Timesheet update schema
export const updateTimesheetSchema = createTimesheetSchema.partial()

// Task schema
export const taskSchema = z.object({
  id: idSchema.optional(),
  tenantId: tenantIdSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  status: statusSchema,
  priority: prioritySchema,
  dueDate: dateSchema.optional(),
  assignedTo: idSchema.optional(),
  createdBy: idSchema,
  createdAt: optionalDateSchema,
  updatedAt: optionalDateSchema,
})

// Patient schema
export const patientSchema = z.object({
  id: idSchema.optional(),
  tenantId: tenantIdSchema,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: dateSchema,
  nhsNumber: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  emergencyContact: z.string().optional(),
  createdAt: optionalDateSchema,
  updatedAt: optionalDateSchema,
})

// Care professional schema
export const careProfessionalSchema = z.object({
  id: idSchema.optional(),
  tenantId: tenantIdSchema,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  createdAt: optionalDateSchema,
  updatedAt: optionalDateSchema,
})

// Clinical note schema
export const clinicalNoteSchema = z.object({
  id: idSchema.optional(),
  tenantId: tenantIdSchema,
  patientId: idSchema,
  authorId: idSchema,
  content: z.string().min(1),
  category: z.string().optional(),
  createdAt: optionalDateSchema,
  updatedAt: optionalDateSchema,
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

// Search schema
export const searchSchema = z.object({
  query: z.string().optional(),
  ...paginationSchema.shape,
})

// API response schema
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
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

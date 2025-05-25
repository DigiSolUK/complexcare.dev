// Default tenant ID for development and testing
export const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID || "00000000-0000-0000-0000-000000000000"

// Application constants
export const APP_NAME = "ComplexCare CRM"
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

// Date formats
export const DATE_FORMAT = "dd MMM yyyy"
export const DATE_TIME_FORMAT = "dd MMM yyyy HH:mm"
export const ISO_DATE_FORMAT = "yyyy-MM-dd"

// Status options
export const PATIENT_STATUS_OPTIONS = ["active", "inactive", "discharged", "deceased"]
export const TASK_STATUS_OPTIONS = ["pending", "in_progress", "completed", "cancelled"]
export const APPOINTMENT_STATUS_OPTIONS = ["scheduled", "confirmed", "cancelled", "completed", "no_show"]

// Priority options
export const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"]

// Risk level options
export const RISK_LEVEL_OPTIONS = ["low", "medium", "high"]

// Gender options
export const GENDER_OPTIONS = ["male", "female", "other", "prefer_not_to_say"]

// Activity types
export const ACTIVITY_TYPES = {
  // Patient activities
  PATIENT_CREATED: "patient_created",
  PATIENT_UPDATED: "patient_updated",
  PATIENT_DELETED: "patient_deleted",
  PATIENT_VIEWED: "patient_viewed",
  PATIENT_STATUS_CHANGED: "patient_status_changed",

  // Appointment activities
  APPOINTMENT_CREATED: "appointment_created",
  APPOINTMENT_UPDATED: "appointment_updated",
  APPOINTMENT_CANCELLED: "appointment_cancelled",
  APPOINTMENT_COMPLETED: "appointment_completed",

  // Task activities
  TASK_CREATED: "task_created",
  TASK_UPDATED: "task_updated",
  TASK_COMPLETED: "task_completed",
  TASK_DELETED: "task_deleted",

  // Clinical note activities
  NOTE_CREATED: "note_created",
  NOTE_UPDATED: "note_updated",
  NOTE_DELETED: "note_deleted",

  // User activities
  USER_LOGGED_IN: "user_logged_in",
  USER_LOGGED_OUT: "user_logged_out",
  USER_CREATED: "user_created",
  USER_UPDATED: "user_updated",
  USER_DELETED: "user_deleted",

  // System activities
  SYSTEM_ERROR: "system_error",
  SYSTEM_WARNING: "system_warning",
  SYSTEM_INFO: "system_info",
}

// Routes that don't require authentication
export const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api/auth",
  "/api/health",
]

// Maximum file upload size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024

// Allowed file types for uploads
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]

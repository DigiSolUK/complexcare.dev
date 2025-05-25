// Default tenant ID to use when none is selected
export const DEFAULT_TENANT_ID = "tenant-1"

// Other application constants can be added here
export const APP_NAME = "ComplexCare CRM"
export const APP_VERSION = "1.0.0"

// API endpoints
export const API_BASE_URL = "/api"
export const API_TIMEOUT = 30000 // 30 seconds

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGE = 1

// Date formats
export const DATE_FORMAT = "dd/MM/yyyy"
export const DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm"

// Status options
export const PATIENT_STATUSES = ["active", "inactive", "critical", "stable"]
export const APPOINTMENT_STATUSES = ["scheduled", "completed", "cancelled", "no-show"]
export const TASK_STATUSES = ["pending", "in-progress", "completed", "cancelled"]
export const CARE_PLAN_STATUSES = ["draft", "active", "completed", "cancelled"]

// Risk levels
export const RISK_LEVELS = ["low", "medium", "high"]

// Gender options
export const GENDER_OPTIONS = ["male", "female", "other", "not_specified"]

// User roles
export const USER_ROLES = ["admin", "care_professional", "receptionist", "patient"]

// Feature flags
export const FEATURES = {
  APPOINTMENTS: true,
  MEDICATIONS: true,
  CARE_PLANS: true,
  BILLING: true,
  REPORTING: true,
  MESSAGING: true,
}

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  TENANT_ADMIN: "tenant_admin",
  CARE_PROFESSIONAL: "care_professional",
  PATIENT: "patient",
  VIEWER: "viewer",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const PERMISSIONS = {
  // Global Permissions (Super Admin)
  MANAGE_TENANTS: "manage_tenants",
  VIEW_SYSTEM_HEALTH: "view_system_health",
  MANAGE_SUPERADMIN_USERS: "manage_superadmin_users",
  VIEW_ERROR_LOGS: "view_error_logs",

  // Tenant-specific Permissions
  MANAGE_USERS: "manage_users",
  MANAGE_PATIENTS: "manage_patients",
  MANAGE_CARE_PROFESSIONALS: "manage_care_professionals",
  MANAGE_APPOINTMENTS: "manage_appointments",
  MANAGE_MEDICATIONS: "manage_medications",
  MANAGE_TASKS: "manage_tasks",
  MANAGE_DOCUMENTS: "manage_documents",
  MANAGE_FINANCES: "manage_finances",
  MANAGE_RECRUITMENT: "manage_recruitment",
  MANAGE_CONTENT: "manage_content",
  VIEW_ANALYTICS: "view_analytics",
  VIEW_REPORTS: "view_reports",
  MANAGE_SETTINGS: "manage_settings",
  MANAGE_COMPLIANCE: "manage_compliance",
  MANAGE_PAYROLL: "manage_payroll",
  MANAGE_TIMESHEETS: "manage_timesheets",
  USE_AI_TOOLS: "use_ai_tools",
  VIEW_PATIENT_NOTES: "view_patient_notes",
  ADD_PATIENT_NOTES: "add_patient_notes",
  EDIT_PATIENT_NOTES: "edit_patient_notes",
  DELETE_PATIENT_NOTES: "delete_patient_notes",
  MANAGE_CARE_PLANS: "manage_care_plans",
  VIEW_GP_CONNECT_DATA: "view_gp_connect_data",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS), // Super admin has all permissions
  [ROLES.TENANT_ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_PATIENTS,
    PERMISSIONS.MANAGE_CARE_PROFESSIONALS,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.MANAGE_MEDICATIONS,
    PERMISSIONS.MANAGE_TASKS,
    PERMISSIONS.MANAGE_DOCUMENTS,
    PERMISSIONS.MANAGE_FINANCES,
    PERMISSIONS.MANAGE_RECRUITMENT,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MANAGE_COMPLIANCE,
    PERMISSIONS.MANAGE_PAYROLL,
    PERMISSIONS.MANAGE_TIMESHEETS,
    PERMISSIONS.USE_AI_TOOLS,
    PERMISSIONS.VIEW_PATIENT_NOTES,
    PERMISSIONS.ADD_PATIENT_NOTES,
    PERMISSIONS.EDIT_PATIENT_NOTES,
    PERMISSIONS.DELETE_PATIENT_NOTES,
    PERMISSIONS.MANAGE_CARE_PLANS,
    PERMISSIONS.VIEW_GP_CONNECT_DATA,
  ],
  [ROLES.CARE_PROFESSIONAL]: [
    PERMISSIONS.MANAGE_PATIENTS,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.MANAGE_MEDICATIONS,
    PERMISSIONS.MANAGE_TASKS,
    PERMISSIONS.MANAGE_DOCUMENTS,
    PERMISSIONS.VIEW_PATIENT_NOTES,
    PERMISSIONS.ADD_PATIENT_NOTES,
    PERMISSIONS.EDIT_PATIENT_NOTES,
    PERMISSIONS.MANAGE_CARE_PLANS,
    PERMISSIONS.VIEW_GP_CONNECT_DATA,
  ],
  [ROLES.PATIENT]: [
    PERMISSIONS.VIEW_APPOINTMENTS, // Assuming patients can view their own appointments
    PERMISSIONS.VIEW_MEDICATIONS, // Assuming patients can view their own medications
    PERMISSIONS.VIEW_TASKS, // Assuming patients can view their own tasks
    PERMISSIONS.VIEW_DOCUMENTS, // Assuming patients can view their own documents
    PERMISSIONS.VIEW_PATIENT_NOTES, // Assuming patients can view their own notes
    PERMISSIONS.VIEW_CARE_PLANS, // Assuming patients can view their own care plans
  ] as Permission[], // Explicitly cast to Permission[] to satisfy type checking
  [ROLES.VIEWER]: [PERMISSIONS.VIEW_ANALYTICS, PERMISSIONS.VIEW_REPORTS, PERMISSIONS.VIEW_PATIENT_NOTES],
}

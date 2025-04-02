export const PERMISSIONS = {
  // Patient permissions
  PATIENT_VIEW: "patient:view",
  PATIENT_CREATE: "patient:create",
  PATIENT_UPDATE: "patient:update",
  PATIENT_DELETE: "patient:delete",

  // Appointment permissions
  APPOINTMENT_VIEW: "appointment:view",
  APPOINTMENT_CREATE: "appointment:create",
  APPOINTMENT_UPDATE: "appointment:update",
  APPOINTMENT_DELETE: "appointment:delete",

  // Care plan permissions
  CARE_PLAN_VIEW: "care_plan:view",
  CARE_PLAN_CREATE: "care_plan:create",
  CARE_PLAN_UPDATE: "care_plan:update",
  CARE_PLAN_DELETE: "care_plan:delete",

  // Medication permissions
  MEDICATION_VIEW: "medication:view",
  MEDICATION_CREATE: "medication:create",
  MEDICATION_UPDATE: "medication:update",
  MEDICATION_DELETE: "medication:delete",

  // Document permissions
  DOCUMENT_VIEW: "document:view",
  DOCUMENT_CREATE: "document:create",
  DOCUMENT_UPDATE: "document:update",
  DOCUMENT_DELETE: "document:delete",

  // Compliance permissions
  COMPLIANCE_VIEW: "compliance:view",
  COMPLIANCE_CREATE: "compliance:create",
  COMPLIANCE_UPDATE: "compliance:update",
  COMPLIANCE_DELETE: "compliance:delete",

  // User management permissions
  USER_VIEW: "user:view",
  USER_CREATE: "user:create",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",

  // Role management permissions
  ROLE_VIEW: "role:view",
  ROLE_CREATE: "role:create",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",

  // Tenant management permissions
  TENANT_VIEW: "tenant:view",
  TENANT_CREATE: "tenant:create",
  TENANT_UPDATE: "tenant:update",
  TENANT_DELETE: "tenant:delete",

  // Recruitment permissions
  RECRUITMENT_VIEW: "recruitment:view",
  RECRUITMENT_CREATE: "recruitment:create",
  RECRUITMENT_UPDATE: "recruitment:update",
  RECRUITMENT_DELETE: "recruitment:delete",

  // Content management permissions
  CONTENT_VIEW: "content:view",
  CONTENT_CREATE: "content:create",
  CONTENT_UPDATE: "content:update",
  CONTENT_DELETE: "content:delete",
} as const

// Define role types
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// Define predefined roles with their permissions
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  TENANT_ADMIN: "tenant_admin",
  CLINICAL_ADMIN: "clinical_admin",
  CARE_MANAGER: "care_manager",
  CARE_PROFESSIONAL: "care_professional",
  RECEPTIONIST: "receptionist",
  PATIENT: "patient",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.TENANT_ADMIN]: [
    // Tenant admins can do everything except manage other tenants
    ...Object.values(PERMISSIONS).filter((permission) => !permission.startsWith("tenant:")),
  ],
  [ROLES.CLINICAL_ADMIN]: [
    // Clinical admins can manage patients, appointments, care plans, medications, and documents
    PERMISSIONS.PATIENT_VIEW,
    PERMISSIONS.PATIENT_CREATE,
    PERMISSIONS.PATIENT_UPDATE,
    PERMISSIONS.PATIENT_DELETE,
    PERMISSIONS.APPOINTMENT_VIEW,
    PERMISSIONS.APPOINTMENT_CREATE,
    PERMISSIONS.APPOINTMENT_UPDATE,
    PERMISSIONS.APPOINTMENT_DELETE,
    PERMISSIONS.CARE_PLAN_VIEW,
    PERMISSIONS.CARE_PLAN_CREATE,
    PERMISSIONS.CARE_PLAN_UPDATE,
    PERMISSIONS.CARE_PLAN_DELETE,
    PERMISSIONS.MEDICATION_VIEW,
    PERMISSIONS.MEDICATION_CREATE,
    PERMISSIONS.MEDICATION_UPDATE,
    PERMISSIONS.MEDICATION_DELETE,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_UPDATE,
    PERMISSIONS.DOCUMENT_DELETE,
    PERMISSIONS.COMPLIANCE_VIEW,
    PERMISSIONS.USER_VIEW,
  ],
  [ROLES.CARE_MANAGER]: [
    // Care managers can view and manage patients, appointments, care plans, and documents
    PERMISSIONS.PATIENT_VIEW,
    PERMISSIONS.PATIENT_CREATE,
    PERMISSIONS.PATIENT_UPDATE,
    PERMISSIONS.APPOINTMENT_VIEW,
    PERMISSIONS.APPOINTMENT_CREATE,
    PERMISSIONS.APPOINTMENT_UPDATE,
    PERMISSIONS.CARE_PLAN_VIEW,
    PERMISSIONS.CARE_PLAN_CREATE,
    PERMISSIONS.CARE_PLAN_UPDATE,
    PERMISSIONS.MEDICATION_VIEW,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_UPDATE,
    PERMISSIONS.COMPLIANCE_VIEW,
  ],
  [ROLES.CARE_PROFESSIONAL]: [
    // Care professionals can view patients, appointments, care plans, and documents
    PERMISSIONS.PATIENT_VIEW,
    PERMISSIONS.APPOINTMENT_VIEW,
    PERMISSIONS.APPOINTMENT_CREATE,
    PERMISSIONS.APPOINTMENT_UPDATE,
    PERMISSIONS.CARE_PLAN_VIEW,
    PERMISSIONS.CARE_PLAN_UPDATE,
    PERMISSIONS.MEDICATION_VIEW,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_CREATE,
  ],
  [ROLES.RECEPTIONIST]: [
    // Receptionists can view and manage appointments
    PERMISSIONS.PATIENT_VIEW,
    PERMISSIONS.APPOINTMENT_VIEW,
    PERMISSIONS.APPOINTMENT_CREATE,
    PERMISSIONS.APPOINTMENT_UPDATE,
    PERMISSIONS.DOCUMENT_VIEW,
  ],
  [ROLES.PATIENT]: [
    // Patients can view their own data
    PERMISSIONS.PATIENT_VIEW,
    PERMISSIONS.APPOINTMENT_VIEW,
    PERMISSIONS.CARE_PLAN_VIEW,
    PERMISSIONS.MEDICATION_VIEW,
    PERMISSIONS.DOCUMENT_VIEW,
  ],
}


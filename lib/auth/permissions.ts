// Defines a centralized list of permissions for the application.
export const PERMISSIONS = {
  // Patient Permissions
  PATIENT_READ: "patient:read",
  PATIENT_CREATE: "patient:create",
  PATIENT_UPDATE: "patient:update",
  PATIENT_DELETE: "patient:delete",

  // User Permissions
  USER_MANAGE: "user:manage",

  // Tenant Admin Permissions
  TENANT_ADMIN: "tenant:admin",

  // Super Admin Permissions
  SUPER_ADMIN: "super:admin",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  TENANT_ADMIN = "tenant_admin",
  CARE_PROFESSIONAL = "care_professional",
  PATIENT = "patient",
}

export type Permissions = typeof PERMISSIONS

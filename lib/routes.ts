/**
 * Application route definitions
 * This file centralizes all route paths to avoid hardcoding URLs throughout the application
 */

export const routes = {
  // Dashboard routes
  dashboard: "/dashboard",

  // Patient routes
  patients: {
    list: "/patients",
    details: (id: string) => `/patients/${id}`,
    medications: (id: string) => `/patients/${id}/medications`,
    cached: "/patients/cached",
  },

  // Care professionals routes
  careProfessionals: {
    list: "/care-professionals",
    details: (id: string) => `/care-professionals/${id}`,
    edit: (id: string) => `/care-professionals/${id}/edit`,
    credentials: {
      list: (id: string) => `/care-professionals/${id}/credentials`,
      new: (id: string) => `/care-professionals/${id}/credentials/new`,
      details: (id: string, credentialId: string) => `/care-professionals/${id}/credentials/${credentialId}`,
      verify: (id: string, credentialId: string) => `/care-professionals/${id}/credentials/${credentialId}/verify`,
    },
  },

  // Clinical notes routes
  clinicalNotes: "/clinical-notes",

  // Appointments routes
  appointments: "/appointments",

  // Care plans routes
  carePlans: "/care-plans",

  // Tasks routes
  tasks: "/tasks",

  // Timesheets routes
  timesheets: "/timesheets",

  // Invoicing routes
  invoicing: {
    list: "/invoicing",
    details: (id: string) => `/invoicing/${id}`,
  },

  // Settings routes
  settings: {
    general: "/settings",
    api: "/settings/api",
    integrations: "/settings/integrations",
    availability: "/settings/availability",
  },

  // System routes
  system: {
    diagnostics: {
      main: "/diagnostics",
      database: "/diagnostics/database",
      schema: "/diagnostics/schema",
    },
    debug: "/debug",
  },

  // Auth routes
  auth: {
    login: "/login",
    liveLogin: "/live-login",
    unauthorized: "/unauthorized",
  },

  // Marketing routes
  marketing: {
    home: "/",
    features: "/features",
    security: "/security",
    about: "/about",
    contact: "/contact",
    legal: "/legal",
    blog: "/blog",
    roadmap: "/roadmap",
    pricing: "/pricing",
  },

  // Admin routes
  admin: {
    errorTracking: "/admin/error-tracking",
    tenantManagement: "/admin/tenant-management",
  },

  // Superadmin routes
  superadmin: {
    dashboard: "/superadmin",
    tenants: "/superadmin/tenants",
    tenantUsers: (id: string) => `/superadmin/tenants/${id}/users`,
    createTenant: "/superadmin/create-tenant",
    auth: "/superadmin/auth",
  },

  // AI tools routes
  ai: {
    tools: "/ai-tools",
    analytics: "/ai-analytics",
    clinicalDecisionSupport: "/clinical-decision-support",
    medicationInteractions: "/medication-interactions",
  },
}

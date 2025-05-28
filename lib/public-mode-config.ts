// Configuration for public mode
export const PUBLIC_MODE = {
  enabled: true,
  defaultTenantId: "tenant-1",
  defaultUserId: "default-user-id",
  mockDataEnabled: true,
  persistChanges: false,
  showPublicModeBanner: true,
}

// Helper function to check if public mode is enabled
export function isPublicModeEnabled(): boolean {
  return PUBLIC_MODE.enabled
}

// Helper function to get default tenant ID
export function getDefaultTenantId(): string {
  return PUBLIC_MODE.defaultTenantId
}

// Helper function to get default user ID
export function getDefaultUserId(): string {
  return PUBLIC_MODE.defaultUserId
}

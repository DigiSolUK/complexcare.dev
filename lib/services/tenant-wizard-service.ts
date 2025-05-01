export async function createTenant(data: any) {
  // This would normally create a tenant in your database
  // For now, just return a mock tenant
  return {
    id: "tenant_" + Math.random().toString(36).substring(2, 15),
    name: data.name,
    createdAt: new Date().toISOString(),
  }
}

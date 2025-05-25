import { useTenant } from "@/contexts"
import { useQuery } from "@tanstack/react-query"

export const useTenantData = () => {
  const tenant = useTenant()

  return useQuery({
    queryKey: ["tenant", tenant?.tenantId],
    queryFn: async () => {
      if (!tenant?.tenantId) {
        return null
      }

      // Replace this with your actual data fetching logic
      const response = await fetch(`/api/tenant/${tenant.tenantId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch tenant data")
      }
      return await response.json()
    },
    enabled: !!tenant?.tenantId,
  })
}

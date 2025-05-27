import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTenant } from "@/contexts/tenant-context"

export const useTenantData = () => {
  const { tenantId } = useTenant()

  return useQuery({
    queryKey: ["tenant", tenantId],
    queryFn: async () => {
      if (!tenantId) {
        return null
      }

      const response = await fetch(`/api/tenants/${tenantId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch tenant data")
      }
      return await response.json()
    },
    enabled: !!tenantId,
  })
}

export const useCreateTenantData = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create tenant")
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] })
    },
  })
}

export const useUpdateTenantData = () => {
  const queryClient = useQueryClient()
  const { tenantId } = useTenant()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/tenants/${tenantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update tenant")
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant", tenantId] })
    },
  })
}

export const useDeleteTenantData = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tenantId: string) => {
      const response = await fetch(`/api/tenants/${tenantId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete tenant")
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] })
    },
  })
}

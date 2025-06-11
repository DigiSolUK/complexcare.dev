"use client"

import { useState, useEffect, useCallback } from "react"
import { getCareProfessionalsAction } from "@/lib/actions/care-professional-actions" // Assuming this action exists
import type { CareProfessional } from "@/types"
import { useToast } from "@/components/ui/use-toast"

export function useCareProfessionals() {
  const [careProfessionals, setCareProfessionals] = useState<CareProfessional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchCareProfessionals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getCareProfessionalsAction()
      if (result.success) {
        setCareProfessionals(result.data || [])
      } else {
        setError(result.error || "Failed to fetch care professionals.")
        toast({
          title: "Error",
          description: result.error || "Failed to fetch care professionals.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Unexpected error fetching care professionals:", err)
      setError("An unexpected error occurred while fetching care professionals.")
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching care professionals.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchCareProfessionals()
  }, [fetchCareProfessionals])

  return { careProfessionals, loading, error, refetchCareProfessionals: fetchCareProfessionals }
}

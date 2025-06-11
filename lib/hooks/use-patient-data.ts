"use client"

import { useState, useEffect, useCallback } from "react"
import { getPatientsAction } from "@/lib/actions/patient-actions" // Assuming this action exists
import type { Patient } from "@/types"
import { useToast } from "@/components/ui/use-toast"

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getPatientsAction()
      if (result.success) {
        setPatients(result.data || [])
      } else {
        setError(result.error || "Failed to fetch patients.")
        toast({
          title: "Error",
          description: result.error || "Failed to fetch patients.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Unexpected error fetching patients:", err)
      setError("An unexpected error occurred while fetching patients.")
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching patients.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  return { patients, loading, error, refetchPatients: fetchPatients }
}

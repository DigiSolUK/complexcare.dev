"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CarePlanForm } from "./care-plan-form"
import type { CarePlan } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface EditCarePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  carePlan: CarePlan | null
  onSuccess: () => void
}

export function EditCarePlanDialog({ open, onOpenChange, carePlan, onSuccess }: EditCarePlanDialogProps) {
  const { toast } = useToast()
  const [defaultValues, setDefaultValues] = useState<any>(null)

  useEffect(() => {
    if (carePlan) {
      setDefaultValues({
        ...carePlan,
        start_date: carePlan.start_date ? new Date(carePlan.start_date) : new Date(),
        end_date: carePlan.end_date ? new Date(carePlan.end_date) : null,
        review_date: carePlan.review_date ? new Date(carePlan.review_date) : null,
        // Ensure assigned_to is null if empty string for select
        assigned_to: carePlan.assigned_to || "",
      })
    }
  }, [carePlan])

  const handleSubmit = async (data: any) => {
    if (!carePlan?.id) return

    try {
      const response = await fetch(`/api/care-plans/${carePlan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update care plan")
      }

      toast({
        title: "Success",
        description: "Care plan updated successfully.",
      })
      onSuccess() // Refresh data in the parent component
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update care plan: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  if (!carePlan || !defaultValues) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Care Plan: {carePlan.title}</DialogTitle>
        </DialogHeader>
        <CarePlanForm
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          isEdit={true}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CarePlanForm } from "./care-plan-form"
import { useToast } from "@/hooks/use-toast"

interface CreateCarePlanDialogProps {
  trigger?: React.ReactNode
  onSuccess?: () => void // Callback to refresh data after creation
}

export function CreateCarePlanDialog({ trigger, onSuccess }: CreateCarePlanDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/care-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create care plan")
      }

      toast({
        title: "Success",
        description: "Care plan created successfully.",
      })
      setOpen(false)
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Error creating care plan:", error)
      toast({
        title: "Error",
        description: `Failed to create care plan: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Care Plan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Care Plan</DialogTitle>
        </DialogHeader>
        <CarePlanForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CarePlanForm } from "./care-plan-form"

interface CreateCarePlanDialogProps {
  trigger?: React.ReactNode
}

export function CreateCarePlanDialog({ trigger }: CreateCarePlanDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (data: any) => {
    try {
      // In a real app, this would call an API to create the care plan
      console.log("Creating care plan:", data)

      // Close the dialog after successful submission
      setOpen(false)

      // Show success message or refresh data
    } catch (error) {
      console.error("Error creating care plan:", error)
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
        <CarePlanForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

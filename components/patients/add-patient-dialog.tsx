"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddPatientForm } from "./add-patient-form"
import { UserPlus } from "lucide-react"

interface AddPatientDialogProps {
  onPatientAdded?: () => void
}

export function AddPatientDialog({ onPatientAdded }: AddPatientDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
    if (onPatientAdded) {
      onPatientAdded()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient's details below. Required fields are marked with an asterisk.
          </DialogDescription>
        </DialogHeader>
        <AddPatientForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

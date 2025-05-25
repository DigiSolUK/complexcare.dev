"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Download, Loader2 } from "lucide-react"

interface ImportGPConnectDialogProps {
  patientId: string
  nhsNumber?: string
  onImportComplete?: () => void
}

export function ImportGPConnectDialog({ patientId, nhsNumber = "", onImportComplete }: ImportGPConnectDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inputNhsNumber, setInputNhsNumber] = useState(nhsNumber)
  const [importOptions, setImportOptions] = useState({
    conditions: true,
    allergies: true,
    medications: true,
    immunizations: false,
  })

  const handleImport = async () => {
    if (!inputNhsNumber) {
      toast({
        title: "Error",
        description: "NHS number is required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/patients/${patientId}/import-gp-connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nhsNumber: inputNhsNumber,
          options: importOptions,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to import GP Connect data")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: data.message || "Successfully imported data from GP Connect",
      })

      setOpen(false)

      if (onImportComplete) {
        onImportComplete()
      }
    } catch (error) {
      console.error("Error importing GP Connect data:", error)
      toast({
        title: "Error",
        description: "Failed to import GP Connect data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckboxChange = (option: keyof typeof importOptions) => {
    setImportOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Import from GP Connect
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import from GP Connect</DialogTitle>
          <DialogDescription>Import patient data from GP Connect into the patient's medical history.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nhsNumber">NHS Number</Label>
            <Input
              id="nhsNumber"
              value={inputNhsNumber}
              onChange={(e) => setInputNhsNumber(e.target.value)}
              placeholder="e.g., 1234567890"
              disabled={loading}
            />
          </div>

          <div className="space-y-3">
            <Label>Import Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="conditions"
                  checked={importOptions.conditions}
                  onCheckedChange={() => handleCheckboxChange("conditions")}
                  disabled={loading}
                />
                <Label htmlFor="conditions" className="cursor-pointer">
                  Conditions
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allergies"
                  checked={importOptions.allergies}
                  onCheckedChange={() => handleCheckboxChange("allergies")}
                  disabled={loading}
                />
                <Label htmlFor="allergies" className="cursor-pointer">
                  Allergies
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medications"
                  checked={importOptions.medications}
                  onCheckedChange={() => handleCheckboxChange("medications")}
                  disabled={loading}
                />
                <Label htmlFor="medications" className="cursor-pointer">
                  Medications
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="immunizations"
                  checked={importOptions.immunizations}
                  onCheckedChange={() => handleCheckboxChange("immunizations")}
                  disabled={loading}
                />
                <Label htmlFor="immunizations" className="cursor-pointer">
                  Immunizations
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

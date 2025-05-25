"use client"

import type React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"
import { MedicationSearch } from "@/components/medications/medication-search"
import { MedicationDetails } from "@/components/medications/medication-details"
import { toast } from "@/components/ui/use-toast"

interface AddMedicationDialogProps {
  patientId: string
  onMedicationAdded?: () => void
}

export function AddMedicationDialog({ patientId, onMedicationAdded }: AddMedicationDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<any>(null)
  const [showMedicationDetails, setShowMedicationDetails] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("")
  const [route, setRoute] = useState("")
  const [prescribedBy, setPrescribedBy] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMedication) {
      toast({
        title: "Error",
        description: "Please select a medication",
        variant: "destructive",
      })
      return
    }

    if (!startDate) {
      toast({
        title: "Error",
        description: "Please select a start date",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real implementation, this would call an API
      // For demo purposes, we'll simulate adding a medication

      toast({
        title: "Success",
        description: "Medication added successfully",
      })

      // Reset form
      setSelectedMedication(null)
      setStartDate(new Date())
      setEndDate(undefined)
      setDosage("")
      setFrequency("")
      setRoute("")
      setPrescribedBy("")
      setNotes("")

      // Close dialog
      setOpen(false)

      // Callback
      if (onMedicationAdded) {
        onMedicationAdded()
      }
    } catch (error) {
      console.error("Error adding medication:", error)
      toast({
        title: "Error",
        description: "Failed to add medication",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Medication</DialogTitle>
          <DialogDescription>
            Search for a medication using the dm+d database and add it to the patient's record.
          </DialogDescription>
        </DialogHeader>

        {showMedicationDetails && selectedMedication ? (
          <div className="space-y-4">
            <MedicationDetails
              medicationId={selectedMedication.value}
              onClose={() => setShowMedicationDetails(false)}
            />
            <Button variant="outline" onClick={() => setShowMedicationDetails(false)}>
              Back to Form
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medication">Medication</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <MedicationSearch
                    onSelect={(medication) => setSelectedMedication(medication)}
                    placeholder="Search for a medication..."
                  />
                </div>
                {selectedMedication && (
                  <Button type="button" variant="outline" onClick={() => setShowMedicationDetails(true)}>
                    View Details
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" id="startDate">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" id="endDate">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g., 500mg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  placeholder="e.g., Twice daily"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="route">Route</Label>
                <Select value={route} onValueChange={setRoute}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oral">Oral</SelectItem>
                    <SelectItem value="topical">Topical</SelectItem>
                    <SelectItem value="inhalation">Inhalation</SelectItem>
                    <SelectItem value="injection">Injection</SelectItem>
                    <SelectItem value="rectal">Rectal</SelectItem>
                    <SelectItem value="vaginal">Vaginal</SelectItem>
                    <SelectItem value="ophthalmic">Ophthalmic</SelectItem>
                    <SelectItem value="otic">Otic</SelectItem>
                    <SelectItem value="nasal">Nasal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prescribedBy">Prescribed By</Label>
                <Input
                  id="prescribedBy"
                  value={prescribedBy}
                  onChange={(e) => setPrescribedBy(e.target.value)}
                  placeholder="e.g., Dr. Smith"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes about this medication..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Medication</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

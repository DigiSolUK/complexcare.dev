"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Pencil, Save, X } from "lucide-react"
import { updatePatient } from "@/lib/actions/patient-actions"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

interface PatientDemographicsEditorProps {
  patient: any
  onPatientUpdated?: (updatedPatient: any) => void
}

export function PatientDemographicsEditor({ patient, onPatientUpdated }: PatientDemographicsEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState(patient)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updatePatient(patient.id, formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Patient demographics updated successfully",
        })
        setIsEditing(false)
        if (onPatientUpdated) {
          onPatientUpdated(result.data)
        }
      } else {
        throw new Error(result.error || "Failed to update patient")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update patient demographics",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(patient)
    setIsEditing(false)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided"
    try {
      return format(new Date(dateString), "dd MMM yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Patient Demographics</CardTitle>
          <CardDescription>Personal and contact information</CardDescription>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nhs_number">NHS Number</Label>
            {isEditing ? (
              <Input id="nhs_number" name="nhs_number" value={formData.nhs_number || ""} onChange={handleChange} />
            ) : (
              <div className="text-sm font-medium">{patient.nhs_number || "Not provided"}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            {isEditing ? (
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleChange}
                required
              />
            ) : (
              <div className="text-sm font-medium">{patient.first_name}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            {isEditing ? (
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name || ""}
                onChange={handleChange}
                required
              />
            ) : (
              <div className="text-sm font-medium">{patient.last_name}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            {isEditing ? (
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth ? formData.date_of_birth.substring(0, 10) : ""}
                onChange={handleChange}
                required
              />
            ) : (
              <div className="text-sm font-medium">{formatDate(patient.date_of_birth)}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            {isEditing ? (
              <Select value={formData.gender || ""} onValueChange={(value) => handleSelectChange("gender", value)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                  <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm font-medium">
                {patient.gender === "MALE"
                  ? "Male"
                  : patient.gender === "FEMALE"
                    ? "Female"
                    : patient.gender === "OTHER"
                      ? "Other"
                      : patient.gender === "PREFER_NOT_TO_SAY"
                        ? "Prefer not to say"
                        : "Not provided"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            {isEditing ? (
              <Select value={formData.status || ""} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="DISCHARGED">Discharged</SelectItem>
                  <SelectItem value="DECEASED">Deceased</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm font-medium">
                {patient.status === "ACTIVE"
                  ? "Active"
                  : patient.status === "INACTIVE"
                    ? "Inactive"
                    : patient.status === "DISCHARGED"
                      ? "Discharged"
                      : patient.status === "DECEASED"
                        ? "Deceased"
                        : "Not provided"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_number">Contact Number</Label>
            {isEditing ? (
              <Input
                id="contact_number"
                name="contact_number"
                value={formData.contact_number || ""}
                onChange={handleChange}
              />
            ) : (
              <div className="text-sm font-medium">{patient.contact_number || "Not provided"}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleChange} />
            ) : (
              <div className="text-sm font-medium">{patient.email || "Not provided"}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary_care_provider">Primary Care Provider</Label>
            {isEditing ? (
              <Input
                id="primary_care_provider"
                name="primary_care_provider"
                value={formData.primary_care_provider || ""}
                onChange={handleChange}
              />
            ) : (
              <div className="text-sm font-medium">{patient.primary_care_provider || "Not provided"}</div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          {isEditing ? (
            <Textarea id="address" name="address" value={formData.address || ""} onChange={handleChange} rows={3} />
          ) : (
            <div className="text-sm font-medium whitespace-pre-wrap">{patient.address || "Not provided"}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="primary_condition">Primary Condition</Label>
          {isEditing ? (
            <Textarea
              id="primary_condition"
              name="primary_condition"
              value={formData.primary_condition || ""}
              onChange={handleChange}
              rows={3}
            />
          ) : (
            <div className="text-sm font-medium whitespace-pre-wrap">{patient.primary_condition || "Not provided"}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          {isEditing ? (
            <Textarea id="notes" name="notes" value={formData.notes || ""} onChange={handleChange} rows={4} />
          ) : (
            <div className="text-sm font-medium whitespace-pre-wrap">{patient.notes || "No notes provided"}</div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">Last updated: {formatDate(patient.updated_at)}</CardFooter>
    </Card>
  )
}

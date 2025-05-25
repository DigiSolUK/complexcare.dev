"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Save, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Patient } from "@/types/patient"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

interface PatientDemographicsProps {
  patient: Patient
}

export function PatientDemographics({ patient }: PatientDemographicsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Patient>>(patient)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/patients/${patient.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update patient")
      }

      toast({
        title: "Success",
        description: "Patient demographics updated successfully",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating patient:", error)
      toast({
        title: "Error",
        description: "Failed to update patient demographics",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(patient)
    setIsEditing(false)
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
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nhsNumber">NHS Number</Label>
            {isEditing ? (
              <Input id="nhsNumber" name="nhsNumber" value={formData.nhsNumber || ""} onChange={handleChange} />
            ) : (
              <div className="text-sm font-medium">{patient.nhsNumber || "Not provided"}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            {isEditing ? (
              <Select value={formData.title || ""} onValueChange={(value) => handleSelectChange("title", value)}>
                <SelectTrigger id="title">
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr">Mr</SelectItem>
                  <SelectItem value="Mrs">Mrs</SelectItem>
                  <SelectItem value="Miss">Miss</SelectItem>
                  <SelectItem value="Ms">Ms</SelectItem>
                  <SelectItem value="Dr">Dr</SelectItem>
                  <SelectItem value="Prof">Prof</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm font-medium">{patient.title || "Not provided"}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            {isEditing ? (
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                required
              />
            ) : (
              <div className="text-sm font-medium">{patient.firstName}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            {isEditing ? (
              <Input id="lastName" name="lastName" value={formData.lastName || ""} onChange={handleChange} required />
            ) : (
              <div className="text-sm font-medium">{patient.lastName}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            {isEditing ? (
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth ? format(new Date(formData.dateOfBirth), "yyyy-MM-dd") : ""}
                onChange={handleChange}
                required
              />
            ) : (
              <div className="text-sm font-medium">
                {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), "dd MMM yyyy") : "Not provided"}
              </div>
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
            <Label htmlFor="ethnicity">Ethnicity</Label>
            {isEditing ? (
              <Input id="ethnicity" name="ethnicity" value={formData.ethnicity || ""} onChange={handleChange} />
            ) : (
              <div className="text-sm font-medium">{patient.ethnicity || "Not provided"}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredLanguage">Preferred Language</Label>
            {isEditing ? (
              <Input
                id="preferredLanguage"
                name="preferredLanguage"
                value={formData.preferredLanguage || ""}
                onChange={handleChange}
              />
            ) : (
              <div className="text-sm font-medium">{patient.preferredLanguage || "Not provided"}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiresInterpreter">Requires Interpreter</Label>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <Switch
                  id="requiresInterpreter"
                  checked={formData.requiresInterpreter || false}
                  onCheckedChange={(checked) => handleSwitchChange("requiresInterpreter", checked)}
                />
                <span>{formData.requiresInterpreter ? "Yes" : "No"}</span>
              </div>
            ) : (
              <div className="text-sm font-medium">{patient.requiresInterpreter ? "Yes" : "No"}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Marital Status</Label>
            {isEditing ? (
              <Select
                value={formData.maritalStatus || ""}
                onValueChange={(value) => handleSelectChange("maritalStatus", value)}
              >
                <SelectTrigger id="maritalStatus">
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="MARRIED">Married</SelectItem>
                  <SelectItem value="CIVIL_PARTNERSHIP">Civil Partnership</SelectItem>
                  <SelectItem value="DIVORCED">Divorced</SelectItem>
                  <SelectItem value="WIDOWED">Widowed</SelectItem>
                  <SelectItem value="SEPARATED">Separated</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm font-medium">{patient.maritalStatus || "Not provided"}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            {isEditing ? (
              <Input id="occupation" name="occupation" value={formData.occupation || ""} onChange={handleChange} />
            ) : (
              <div className="text-sm font-medium">{patient.occupation || "Not provided"}</div>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">GP Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="gpName">GP Name</Label>
              {isEditing ? (
                <Input id="gpName" name="gpName" value={formData.gpName || ""} onChange={handleChange} />
              ) : (
                <div className="text-sm font-medium">{patient.gpName || "Not provided"}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpSurgery">GP Surgery</Label>
              {isEditing ? (
                <Input id="gpSurgery" name="gpSurgery" value={formData.gpSurgery || ""} onChange={handleChange} />
              ) : (
                <div className="text-sm font-medium">{patient.gpSurgery || "Not provided"}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpPhone">GP Phone</Label>
              {isEditing ? (
                <Input id="gpPhone" name="gpPhone" value={formData.gpPhone || ""} onChange={handleChange} />
              ) : (
                <div className="text-sm font-medium">{patient.gpPhone || "Not provided"}</div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Care Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="referralSource">Referral Source</Label>
              {isEditing ? (
                <Input
                  id="referralSource"
                  name="referralSource"
                  value={formData.referralSource || ""}
                  onChange={handleChange}
                />
              ) : (
                <div className="text-sm font-medium">{patient.referralSource || "Not provided"}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralDate">Referral Date</Label>
              {isEditing ? (
                <Input
                  id="referralDate"
                  name="referralDate"
                  type="date"
                  value={formData.referralDate ? format(new Date(formData.referralDate), "yyyy-MM-dd") : ""}
                  onChange={handleChange}
                />
              ) : (
                <div className="text-sm font-medium">
                  {patient.referralDate ? format(new Date(patient.referralDate), "dd MMM yyyy") : "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="careStartDate">Care Start Date</Label>
              {isEditing ? (
                <Input
                  id="careStartDate"
                  name="careStartDate"
                  type="date"
                  value={formData.careStartDate ? format(new Date(formData.careStartDate), "yyyy-MM-dd") : ""}
                  onChange={handleChange}
                />
              ) : (
                <div className="text-sm font-medium">
                  {patient.careStartDate ? format(new Date(patient.careStartDate), "dd MMM yyyy") : "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="careEndDate">Care End Date</Label>
              {isEditing ? (
                <Input
                  id="careEndDate"
                  name="careEndDate"
                  type="date"
                  value={formData.careEndDate ? format(new Date(formData.careEndDate), "yyyy-MM-dd") : ""}
                  onChange={handleChange}
                />
              ) : (
                <div className="text-sm font-medium">
                  {patient.careEndDate ? format(new Date(patient.careEndDate), "dd MMM yyyy") : "Not provided"}
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
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea id="notes" name="notes" value={formData.notes || ""} onChange={handleChange} rows={4} />
            ) : (
              <div className="text-sm font-medium whitespace-pre-wrap">{patient.notes || "No notes provided"}</div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Last updated: {format(new Date(patient.updatedAt), "dd MMM yyyy HH:mm")}
      </CardFooter>
    </Card>
  )
}

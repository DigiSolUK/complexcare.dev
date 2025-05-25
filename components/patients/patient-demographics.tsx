"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format, parseISO } from "date-fns"
import { Edit, Save, User, Phone, Mail, MapPin, Calendar, Clock } from "lucide-react"
import { updatePatient } from "@/lib/actions/patient-actions"

interface Patient {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  nhs_number?: string
  gender: string
  status: string
  primary_condition?: string
  primary_care_provider?: string
  avatar_url?: string
  contact_number?: string
  email?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  notes?: string
}

interface PatientDemographicsProps {
  patient: Patient
}

export function PatientDemographics({ patient }: PatientDemographicsProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    first_name: patient.first_name,
    last_name: patient.last_name,
    date_of_birth: patient.date_of_birth,
    nhs_number: patient.nhs_number || "",
    gender: patient.gender,
    status: patient.status,
    contact_number: patient.contact_number || "",
    email: patient.email || "",
    address: patient.address || "",
    emergency_contact_name: patient.emergency_contact_name || "",
    emergency_contact_phone: patient.emergency_contact_phone || "",
    primary_condition: patient.primary_condition || "",
    primary_care_provider: patient.primary_care_provider || "",
    notes: patient.notes || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await updatePatient(patient.id, formData)
      if (result.success) {
        setIsEditing(false)
        router.refresh()
      } else {
        console.error("Failed to update patient:", result.error)
      }
    } catch (error) {
      console.error("Error updating patient:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP")
    } catch (e) {
      return dateString
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "critical":
        return "bg-red-100 text-red-800"
      case "stable":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Patient Demographics</CardTitle>
          <CardDescription>Personal and contact information</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} disabled={isSubmitting}>
          {isEditing ? (
            <>
              <Clock className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nhs_number">NHS Number</Label>
              <Input id="nhs_number" name="nhs_number" value={formData.nhs_number} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" name="gender" value={formData.gender} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input id="status" name="status" value={formData.status} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_number">Contact Number</Label>
              <Input
                id="contact_number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
              <Input
                id="emergency_contact_name"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
              <Input
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="primary_condition">Primary Condition</Label>
              <Textarea
                id="primary_condition"
                name="primary_condition"
                value={formData.primary_condition}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="primary_care_provider">Primary Care Provider</Label>
              <Input
                id="primary_care_provider"
                name="primary_care_provider"
                value={formData.primary_care_provider}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Personal Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Name:</span>
                    <span className="ml-2">
                      {patient.first_name} {patient.last_name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Date of Birth:</span>
                    <span className="ml-2">{formatDate(patient.date_of_birth)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">NHS Number:</span>
                    <span className="ml-2">{patient.nhs_number || "Not provided"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Gender:</span>
                    <span className="ml-2">{patient.gender}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Status:</span>
                    <Badge className={`ml-2 ${getStatusColor(patient.status)}`}>{patient.status}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{patient.contact_number || "Not provided"}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{patient.email || "Not provided"}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <span className="font-medium">Address:</span>
                    <span className="ml-2">{patient.address || "Not provided"}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Emergency Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{patient.emergency_contact_name || "Not provided"}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{patient.emergency_contact_phone || "Not provided"}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Medical Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Primary Condition:</span>
                  <p className="mt-1">{patient.primary_condition || "Not provided"}</p>
                </div>
                <div>
                  <span className="font-medium">Primary Care Provider:</span>
                  <p className="mt-1">{patient.primary_care_provider || "Not provided"}</p>
                </div>
              </div>
            </div>

            {patient.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Additional Notes</h3>
                  <p className="text-sm">{patient.notes}</p>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
